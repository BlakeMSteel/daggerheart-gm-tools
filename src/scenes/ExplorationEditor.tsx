import { Stack, TextField, Typography } from "@mui/material";
import EntryBox from "../components/EntryBox";
import { ImageInput } from "./ImageInput";
import type { ExplorationScene } from "./types";

interface ExplorationEditorProps {
  scene: ExplorationScene;
  onChange: (scene: ExplorationScene) => void;
}

export function ExplorationEditor({ scene, onChange }: ExplorationEditorProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h6">Location</Typography>
      <EntryBox sx={{ maxWidth: 640 }}>
        <ImageInput
          label={scene.name || "Location"}
          value={scene.image}
          onChange={(image) => onChange({ ...scene, image })}
        />
        <TextField
          label="Description"
          size="small"
          fullWidth
          multiline
          minRows={6}
          value={scene.description}
          onChange={(e) => onChange({ ...scene, description: e.target.value })}
        />
      </EntryBox>
    </Stack>
  );
}
