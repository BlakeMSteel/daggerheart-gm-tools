import { useState } from "react";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { isSyncConfigured, type ChannelStatus } from "../sync/fearChannel";

const STATUS_LABELS: Record<
  ChannelStatus,
  { label: string; color: "default" | "success" | "warning" | "error" }
> = {
  off: { label: "Not sharing", color: "default" },
  connecting: { label: "Connecting…", color: "warning" },
  live: { label: "Listening for players", color: "success" },
  error: { label: "Connection problem", color: "error" },
};

interface ShareFearDialogProps {
  open: boolean;
  onClose: () => void;
  code: string | null;
  status: ChannelStatus;
  onNewCode: () => void;
}

/** Lets the GM share a link that players use to add Fear. */
export default function ShareFearDialog({
  open,
  onClose,
  code,
  status,
  onNewCode,
}: ShareFearDialogProps) {
  const [copied, setCopied] = useState(false);
  const link = code
    ? `${window.location.origin}${import.meta.env.BASE_URL}fear/${code}`
    : "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; the link is still selectable in the field
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Share Fear with players</DialogTitle>
      <DialogContent>
        {!isSyncConfigured ? (
          <Typography color="text.secondary">
            Sharing isn't set up for this site yet: it needs Supabase settings
            when it's built.
          </Typography>
        ) : !code ? (
          <Typography color="text.secondary">
            Create a link for your players. Anyone with it can add Fear, and
            they'll see the current total.
          </Typography>
        ) : (
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Player link"
              value={link}
              fullWidth
              slotProps={{
                htmlInput: { readOnly: true },
                inputLabel: { shrink: true },
              }}
              onFocus={(e) => e.target.select()}
            />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Code <strong>{code}</strong>
              </Typography>
              <Chip
                size="small"
                label={STATUS_LABELS[status].label}
                color={STATUS_LABELS[status].color}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Players can add Fear while this page is open. A new code stops the
              old link from working.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        {isSyncConfigured && code && (
          <Button onClick={onNewCode}>New code</Button>
        )}
        <Button onClick={onClose}>Close</Button>
        {isSyncConfigured &&
          (code ? (
            <Button variant="contained" onClick={copy}>
              {copied ? "Copied" : "Copy link"}
            </Button>
          ) : (
            <Button variant="contained" onClick={onNewCode}>
              Create link
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
}
