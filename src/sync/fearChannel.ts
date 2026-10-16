import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";

/**
 * Shares Fear between the GM's page and players' pages over a Supabase Realtime
 * Broadcast channel named after a share code. Nothing is stored: players send
 * "add" messages, the GM's page applies them and broadcasts the new total.
 */

export type FearMessage =
  /** Player → GM: add Fear (the GM's page clamps the result). */
  | { type: "add"; amount: number }
  /** GM → players: the current Fear. */
  | { type: "total"; value: number }
  /** Player → GM: sent on joining, asking the GM's page to send the total. */
  | { type: "request" };

export type ChannelStatus = "off" | "connecting" | "live" | "error";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

/** Whether this build has Supabase settings; without them sharing is unavailable. */
export const isSyncConfigured = !!SUPABASE_URL && !!SUPABASE_KEY;

let clientPromise: Promise<SupabaseClient> | null = null;

// Loaded on first use so the Supabase library isn't in the main bundle.
function getClient(): Promise<SupabaseClient> {
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(SUPABASE_URL!, SUPABASE_KEY!),
  );
  return clientPromise;
}

// Unambiguous characters only (no 0/O, 1/I/L), so codes are easy to read aloud.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

/** A random share code. Anyone with the code can add Fear, so it must be hard to guess. */
export function newShareCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join(
    "",
  );
}

/**
 * Joins the Fear channel for `code` (or none when null) and calls `onMessage` for
 * every message from other pages (with `send`, for replying). Returns the connection
 * status and a `send` function.
 */
export function useFearChannel(
  code: string | null,
  onMessage: (
    message: FearMessage,
    send: (message: FearMessage) => void,
  ) => void,
): { status: ChannelStatus; send: (message: FearMessage) => void } {
  // Status is tracked per code, so a new code reads as "connecting" until it joins.
  const [entry, setEntry] = useState<{
    code: string;
    status: ChannelStatus;
  } | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const onMessageRef = useRef(onMessage);

  // Stable across renders, so callers can use it in effect dependencies.
  const send = useCallback((message: FearMessage) => {
    void channelRef.current?.send({
      type: "broadcast",
      event: "fear",
      payload: message,
    });
  }, []);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!code || !isSyncConfigured) return;
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    getClient().then((client) => {
      if (cancelled) return;
      channel = client
        .channel(`fear:${code}`, { config: { broadcast: { self: false } } })
        .on("broadcast", { event: "fear" }, ({ payload }) =>
          onMessageRef.current(payload as FearMessage, send),
        )
        .subscribe((status) => {
          if (cancelled) return;
          if (status === "SUBSCRIBED") {
            channelRef.current = channel;
            setEntry({ code, status: "live" });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            channelRef.current = null;
            setEntry({ code, status: "error" });
          }
        });
    });

    return () => {
      cancelled = true;
      channelRef.current = null;
      if (channel)
        void getClient().then((client) => client.removeChannel(channel!));
    };
  }, [code, send]);

  let status: ChannelStatus = "off";
  if (code && isSyncConfigured)
    status = entry?.code === code ? entry.status : "connecting";

  return { status, send };
}
