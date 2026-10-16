import { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import SceneTypeChip from "../components/SceneTypeChip";
import { CombatEditor } from "../scenes/CombatEditor";
import { ExplorationEditor } from "../scenes/ExplorationEditor";
import { SocialEditor } from "../scenes/SocialEditor";
import { deleteScene, getScene, saveScene } from "../scenes/db";
import {
  newScene,
  SCENE_TYPE_LABELS,
  type Scene,
  type SceneType,
} from "../scenes/types";

/** Edits a stored scene (/scenes/:id/edit) or a new unsaved draft (/scenes/new/:type). */
export function SceneEditPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const isNew = id === undefined;

  const [scene, setScene] = useState<Scene | null | undefined>(() =>
    isNew && type && type in SCENE_TYPE_LABELS
      ? newScene(type as SceneType)
      : undefined,
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) getScene(id).then((s) => setScene(s ?? null));
  }, [id]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

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

  const update = (next: Scene) => {
    setScene(next);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveScene(scene);
    setSaving(false);
    setDirty(false);
    if (isNew) navigate(`/scenes/${scene.id}/edit`, { replace: true });
  };

  const handleBack = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    navigate("/");
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${scene.name || "Untitled scene"}"?`)) return;
    await deleteScene(scene.id);
    navigate("/");
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
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {isNew ? "New scene" : "Edit scene"}
          </Typography>
          <SceneTypeChip type={scene.type} />
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          {dirty && (
            <Typography variant="body2" color="text.secondary">
              Unsaved changes
            </Typography>
          )}
          <Button onClick={handleBack}>Back</Button>
          {!isNew && (
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || (!dirty && !isNew)}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </Stack>
      </Box>

      <TextField
        label="Scene name"
        size="small"
        placeholder="Untitled scene"
        autoFocus={isNew}
        value={scene.name}
        onChange={(e) => update({ ...scene, name: e.target.value })}
        sx={{ maxWidth: 480 }}
      />

      {scene.type === "social" && (
        <SocialEditor scene={scene} onChange={update} />
      )}
      {scene.type === "combat" && (
        <CombatEditor scene={scene} onChange={update} />
      )}
      {scene.type === "exploration" && (
        <ExplorationEditor scene={scene} onChange={update} />
      )}
    </Stack>
  );
}
