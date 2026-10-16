import { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import SceneTypeChip from "../components/SceneTypeChip";
import { CombatEditor } from "./CombatEditor";
import { ExplorationEditor } from "./ExplorationEditor";
import { SocialEditor } from "./SocialEditor";
import { deleteScene, saveScene } from "./db";
import {
  newScene,
  SCENE_TYPE_LABELS,
  type Scene,
  type SceneType,
} from "./types";

/** Whether the scene has anything entered beyond its name, which a type change would discard. */
function hasTypeContent(scene: Scene): boolean {
  switch (scene.type) {
    case "social":
      return scene.npcs.length > 0;
    case "combat":
      return scene.enemies.length > 0;
    case "exploration":
      return scene.description !== "" || scene.image !== null;
  }
}

interface SceneFormProps {
  initialScene: Scene;
  isNew: boolean;
}

/** Editing form for one scene; holds the unsaved draft until Save. */
export function SceneForm({ initialScene, isNew }: SceneFormProps) {
  const navigate = useNavigate();
  const [scene, setScene] = useState(initialScene);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (next: Scene) => {
    setScene(next);
    setDirty(true);
  };

  const changeType = (type: SceneType) => {
    if (type === scene.type) return;
    if (
      hasTypeContent(scene) &&
      !confirm(
        `Switch to ${SCENE_TYPE_LABELS[type]}? This clears what you've entered below.`,
      )
    )
      return;
    update({ ...newScene(type), id: scene.id, name: scene.name });
  };

  const handleSave = async () => {
    setSaving(true);
    await saveScene(scene);
    setSaving(false);
    setDirty(false);
    if (isNew) navigate(`/edit/${scene.id}`, { replace: true });
  };

  const handleBack = () => {
    if (dirty && !confirm("Discard unsaved changes?")) return;
    navigate("/edit");
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${scene.name || "Untitled scene"}"?`)) return;
    await deleteScene(scene.id);
    navigate("/edit");
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

      {isNew && (
        <TextField
          select
          label="Scene type"
          size="small"
          value={scene.type}
          onChange={(e) => changeType(e.target.value as SceneType)}
          sx={{ maxWidth: 480 }}
        >
          {(Object.keys(SCENE_TYPE_LABELS) as SceneType[]).map((type) => (
            <MenuItem key={type} value={type}>
              {SCENE_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
      )}

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
