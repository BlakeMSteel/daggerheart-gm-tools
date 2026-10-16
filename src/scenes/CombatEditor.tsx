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
import { MAX_ENEMIES, newEnemy, type CombatScene, type Enemy } from "./types";

type StatKey =
  | "difficulty"
  | "hp"
  | "stress"
  | "majorThreshold"
  | "severeThreshold";

const STATS: { key: StatKey; label: string }[] = [
  { key: "difficulty", label: "Difficulty" },
  { key: "hp", label: "HP" },
  { key: "stress", label: "Stress" },
  { key: "majorThreshold", label: "Major threshold" },
  { key: "severeThreshold", label: "Severe threshold" },
];

interface CombatEditorProps {
  scene: CombatScene;
  onChange: (scene: CombatScene) => void;
}

export function CombatEditor({ scene, onChange }: CombatEditorProps) {
  const updateEnemy = (id: string, changes: Partial<Enemy>) =>
    onChange({
      ...scene,
      enemies: scene.enemies.map((e) =>
        e.id === id ? { ...e, ...changes } : e,
      ),
    });

  return (
    <Stack spacing={2}>
      <Typography variant="h6">
        Enemies ({scene.enemies.length}/{MAX_ENEMIES})
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 2,
        }}
      >
        {scene.enemies.map((enemy) => (
          <EntryBox key={enemy.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle2">
                {enemy.name || "New enemy"}
              </Typography>
              <IconButton
                size="small"
                color="error"
                aria-label="Remove enemy"
                onClick={() =>
                  onChange({
                    ...scene,
                    enemies: scene.enemies.filter((e) => e.id !== enemy.id),
                  })
                }
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
            <ImageInput
              label={enemy.name || "Enemy"}
              value={enemy.image}
              onChange={(image) => updateEnemy(enemy.id, { image })}
            />
            <TextField
              label="Name"
              size="small"
              fullWidth
              value={enemy.name}
              onChange={(e) => updateEnemy(enemy.id, { name: e.target.value })}
            />
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              {STATS.map(({ key, label }) => (
                <TextField
                  key={key}
                  label={label}
                  type="number"
                  size="small"
                  slotProps={{ htmlInput: { min: 0 } }}
                  value={enemy[key] ?? ""}
                  onChange={(e) =>
                    updateEnemy(enemy.id, {
                      [key]:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
              ))}
            </Box>
          </EntryBox>
        ))}
      </Box>
      {scene.enemies.length < MAX_ENEMIES && (
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() =>
              onChange({ ...scene, enemies: [...scene.enemies, newEnemy()] })
            }
          >
            Add enemy
          </Button>
        </Box>
      )}
    </Stack>
  );
}
