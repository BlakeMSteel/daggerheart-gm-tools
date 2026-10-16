import { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import SceneTypeChip from "../components/SceneTypeChip";
import { getScene } from "../scenes/db";
import type { Scene } from "../scenes/types";

// /view/:id — placeholder: display mode will be designed later.
export function SceneDisplayPage() {
  const { id } = useParams();
  const [scene, setScene] = useState<Scene | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScene(id).then((s) => setScene(s ?? null));
  }, [id]);

  if (scene === undefined)
    return <Typography color="text.secondary">Loading…</Typography>;
  if (scene === null) return <Typography>Scene not found.</Typography>;

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {scene.name || "Untitled scene"}
        </Typography>
        <SceneTypeChip type={scene.type} />
      </Stack>
      <Typography color="text.secondary">Display mode coming soon.</Typography>
    </Stack>
  );
}
