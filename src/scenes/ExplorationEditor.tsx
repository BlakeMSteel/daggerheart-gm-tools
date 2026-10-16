import { ImageInput } from "./ImageInput";
import type { ExplorationScene } from "./types";

interface ExplorationEditorProps {
  scene: ExplorationScene;
  onChange: (scene: ExplorationScene) => void;
}

export function ExplorationEditor({ scene, onChange }: ExplorationEditorProps) {
  return (
    <section>
      <h2>Location</h2>
      <div className="card exploration-card">
        <ImageInput
          label={scene.name || "Location"}
          value={scene.image}
          onChange={(image) => onChange({ ...scene, image })}
        />
        <label>
          Description
          <textarea
            rows={8}
            value={scene.description}
            onChange={(e) =>
              onChange({ ...scene, description: e.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}
