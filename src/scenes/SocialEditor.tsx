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
    <section>
      <h2>
        NPCs ({scene.npcs.length}/{MAX_NPCS})
      </h2>
      <div className="card-grid">
        {scene.npcs.map((npc) => (
          <div key={npc.id} className="card">
            <ImageInput
              label={npc.name || "NPC"}
              value={npc.image}
              onChange={(image) => updateNpc(npc.id, { image })}
            />
            <label>
              Name
              <input
                value={npc.name}
                onChange={(e) => updateNpc(npc.id, { name: e.target.value })}
              />
            </label>
            <label>
              Title
              <input
                value={npc.title}
                onChange={(e) => updateNpc(npc.id, { title: e.target.value })}
              />
            </label>
            <button
              type="button"
              className="danger"
              onClick={() =>
                onChange({
                  ...scene,
                  npcs: scene.npcs.filter((n) => n.id !== npc.id),
                })
              }
            >
              Remove NPC
            </button>
          </div>
        ))}
      </div>
      {scene.npcs.length < MAX_NPCS && (
        <button
          type="button"
          onClick={() =>
            onChange({ ...scene, npcs: [...scene.npcs, newNpc()] })
          }
        >
          + Add NPC
        </button>
      )}
    </section>
  );
}
