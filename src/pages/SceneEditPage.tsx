import { useEffect, useState } from "react";
import { Button, Stack, Typography } from "@mui/material";
import { Link, useParams } from "react-router";
import { SceneForm } from "../scenes/SceneForm";
import { getScene } from "../scenes/db";
import type { Scene } from "../scenes/types";

/** /edit/:id — edits a stored scene. */
export function SceneEditPage() {
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
        <Button component={Link} to="/edit">
          Back to scenes
        </Button>
      </Stack>
    );
  }

  return <SceneForm key={scene.id} initialScene={scene} isNew={false} />;
}
