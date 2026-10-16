import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router";
import { FEAR_COLOR, MAX_FEAR } from "../components/FearTracker";
import { isSyncConfigured, useFearChannel } from "../sync/fearChannel";

/** /fear/:code — a player's page for adding Fear to the GM's table. */
export function PlayerFearPage() {
  const { code = null } = useParams();
  // Null until the GM's page sends the total.
  const [fear, setFear] = useState<number | null>(null);

  const { status, send } = useFearChannel(code, (message) => {
    if (message.type === "total") setFear(message.value);
  });

  // Ask the GM's page for the total once connected.
  useEffect(() => {
    if (status === "live") send({ type: "request" });
  }, [status, send]);

  let note: string | null = null;
  if (!isSyncConfigured) note = "Fear sharing isn't set up for this site.";
  else if (status === "connecting") note = "Connecting…";
  else if (status === "error")
    note = "Can't connect. Check your connection and reload.";
  else if (fear === null)
    note = "Waiting for the GM… (their View page needs to be open)";

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", letterSpacing: 2 }}
        >
          Fear
        </Typography>
        <Typography
          sx={{
            fontSize: "6rem",
            fontWeight: 700,
            lineHeight: 1,
            color: FEAR_COLOR,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {fear ?? "–"}
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => send({ type: "add", amount: 1 })}
          disabled={status !== "live" || fear === null || fear >= MAX_FEAR}
          sx={{ px: 5, py: 1.5, fontSize: "1.25rem" }}
        >
          Add Fear
        </Button>
        {note && <Typography color="text.secondary">{note}</Typography>}
      </Stack>
    </Box>
  );
}
