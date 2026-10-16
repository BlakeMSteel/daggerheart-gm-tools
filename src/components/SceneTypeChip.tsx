import { Chip } from "@mui/material";
import {
  SCENE_TYPE_COLORS,
  SCENE_TYPE_LABELS,
  type SceneType,
} from "../scenes/types";

export default function SceneTypeChip({ type }: { type: SceneType }) {
  return (
    <Chip
      label={SCENE_TYPE_LABELS[type]}
      size="small"
      sx={{ bgcolor: SCENE_TYPE_COLORS[type], color: "#fff", fontWeight: 600 }}
    />
  );
}
