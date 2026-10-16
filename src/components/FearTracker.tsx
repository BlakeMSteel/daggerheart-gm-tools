import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/** The most Fear the GM can hold, per the core rules. */
export const MAX_FEAR = 12;
const FEAR_COLOR = "#b388ff";

interface FearTrackerProps {
  value: number;
  onChange: (value: number) => void;
}

/** Vertical Fear counter: + on top, the current Fear, − on the bottom. */
export default function FearTracker({ value, onChange }: FearTrackerProps) {
  return (
    <Stack sx={{ alignItems: "center" }} role="group" aria-label="Fear">
      <Tooltip title="Add Fear" placement="right">
        <span>
          <IconButton
            size="small"
            onClick={() => onChange(Math.min(value + 1, MAX_FEAR))}
            disabled={value >= MAX_FEAR}
            aria-label="Add Fear"
          >
            <AddIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Typography
        variant="h5"
        aria-live="polite"
        sx={{
          fontWeight: 700,
          color: FEAR_COLOR,
          minWidth: "2ch",
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.3,
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          lineHeight: 1,
        }}
      >
        Fear
      </Typography>
      <Tooltip title="Spend Fear" placement="right">
        <span>
          <IconButton
            size="small"
            onClick={() => onChange(Math.max(value - 1, 0))}
            disabled={value <= 0}
            aria-label="Spend Fear"
          >
            <RemoveIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
