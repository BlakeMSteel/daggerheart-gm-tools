import { useEffect, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router";
import SceneTypeChip from "../components/SceneTypeChip";
import { getScene } from "../scenes/db";
import type { Scene } from "../scenes/types";

// Placeholder: display mode will be designed later.
export function SceneDisplayPage() {
  const { id } = useParams();
  const [scene, setScene] = useState<Scene | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScene(id).then((s) => setScene(s ?? null));
  }, [id]);

  if (scene === undefined)
    return <Typography color="text.secondary">Loading…</Typography>;
  if (scene === null) {
    return (
      <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
        <Typography>Scene not found.</Typography>
        <Button component={Link} to="/">
          Back to scenes
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {scene.name || "Untitled scene"}
          </Typography>
          <SceneTypeChip type={scene.type} />
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/">
            Back
          </Button>
          <Button
            variant="contained"
            component={Link}
            to={`/scenes/${scene.id}/edit`}
          >
            Edit
          </Button>
        </Stack>
      </Box>
      <Typography color="text.secondary">Display mode coming soon.</Typography>
    </Stack>
  );
}
