import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EntryBox from "../components/EntryBox";
import { ImageInput } from "./ImageInput";
import { MAX_NPCS, newNpc, type Npc, type SocialScene } from "./types";

interface SocialEditorProps {
  scene: SocialScene;
  onChange: (scene: SocialScene) => void;
}

export function SocialEditor({ scene, onChange }: SocialEditorProps) {
  const updateNpc = (id: string, changes: Partial<Npc>) =>
    onChange({
      ...scene,
      npcs: scene.npcs.map((n) => (n.id === id ? { ...n, ...changes } : n)),
    });

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        NPCs ({scene.npcs.length}/{MAX_NPCS})
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        {scene.npcs.map((npc) => (
          <EntryBox key={npc.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2">
                {npc.name || "New NPC"}
              </Typography>
              <IconButton
                size="small"
                color="error"
                aria-label="Remove NPC"
                onClick={() =>
                  onChange({
                    ...scene,
                    npcs: scene.npcs.filter((n) => n.id !== npc.id),
                  })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <ImageInput
              label={npc.name || "NPC"}
              value={npc.image}
              onChange={(image) => updateNpc(npc.id, { image })}
            />
            <TextField
              label="Name"
              size="small"
              fullWidth
              value={npc.name}
              onChange={(e) => updateNpc(npc.id, { name: e.target.value })}
            />
            <TextField
              label="Title"
              size="small"
              fullWidth
              value={npc.title}
              onChange={(e) => updateNpc(npc.id, { title: e.target.value })}
            />
          </EntryBox>
        ))}
      </Box>
      {scene.npcs.length < MAX_NPCS && (
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              onChange({ ...scene, npcs: [...scene.npcs, newNpc()] })
            }
          >
            Add NPC
          </Button>
        </Box>
      )}
    </Stack>
  );
}
