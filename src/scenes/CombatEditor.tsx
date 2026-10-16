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
    <section>
      <h2>
        Enemies ({scene.enemies.length}/{MAX_ENEMIES})
      </h2>
      <div className="card-grid">
        {scene.enemies.map((enemy) => (
          <div key={enemy.id} className="card">
            <ImageInput
              label={enemy.name || "Enemy"}
              value={enemy.image}
              onChange={(image) => updateEnemy(enemy.id, { image })}
            />
            <label>
              Name
              <input
                value={enemy.name}
                onChange={(e) =>
                  updateEnemy(enemy.id, { name: e.target.value })
                }
              />
            </label>
            <div className="stat-grid">
              {STATS.map(({ key, label }) => (
                <label key={key}>
                  {label}
                  <input
                    type="number"
                    min={0}
                    value={enemy[key] ?? ""}
                    onChange={(e) =>
                      updateEnemy(enemy.id, {
                        [key]:
                          e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              className="danger"
              onClick={() =>
                onChange({
                  ...scene,
                  enemies: scene.enemies.filter((e) => e.id !== enemy.id),
                })
              }
            >
              Remove enemy
            </button>
          </div>
        ))}
      </div>
      {scene.enemies.length < MAX_ENEMIES && (
        <button
          type="button"
          onClick={() =>
            onChange({ ...scene, enemies: [...scene.enemies, newEnemy()] })
          }
        >
          + Add enemy
        </button>
      )}
    </section>
  );
}
