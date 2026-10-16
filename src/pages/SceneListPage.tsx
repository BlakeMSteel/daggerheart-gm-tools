import { useEffect, useState } from "react";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router";
import EntryBox from "../components/EntryBox";
import SceneTypeChip from "../components/SceneTypeChip";
import { deleteScene, listScenes } from "../scenes/db";
import type { Scene } from "../scenes/types";

/** /edit — lists saved scenes with create, edit and delete. */
export function SceneListPage() {
  const [scenes, setScenes] = useState<Scene[] | null>(null);

  useEffect(() => {
    listScenes().then(setScenes);
  }, []);

  const handleDelete = async (scene: Scene) => {
    if (!confirm(`Delete "${scene.name || "Untitled scene"}"?`)) return;
    await deleteScene(scene.id);
    setScenes(await listScenes());
  };

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
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Scenes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/edit/new"
        >
          New Scene
        </Button>
      </Box>

      {scenes === null ? (
        <Typography color="text.secondary">Loading…</Typography>
      ) : scenes.length === 0 ? (
        <Typography color="text.secondary">
          No scenes yet. Create one to get started.
        </Typography>
      ) : (
        <Stack spacing={1}>
          {scenes.map((scene) => (
            <EntryBox
              key={scene.id}
              sx={{
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center" }}
              >
                <SceneTypeChip type={scene.type} />
                <Typography sx={{ fontWeight: 600 }}>
                  {scene.name || "Untitled scene"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <Button
                  size="small"
                  variant="outlined"
                  component={Link}
                  to={`/edit/${scene.id}`}
                >
                  Edit
                </Button>
                <IconButton
                  size="small"
                  color="error"
                  aria-label="Delete scene"
                  onClick={() => handleDelete(scene)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>
            </EntryBox>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
