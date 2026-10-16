import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

  if (scene === undefined) return <p className="page muted">Loading…</p>;
  if (scene === null) {
    return (
      <div className="page">
        <p>Scene not found.</p>
        <Link to="/">Back to scenes</Link>
      </div>
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
    <div className="page">
      <div className="page-header">
        <h1>
          {isNew ? "New" : "Edit"} {SCENE_TYPE_LABELS[scene.type]} scene
        </h1>
        <div className="button-row">
          {dirty && <span className="muted">Unsaved changes</span>}
          <button type="button" onClick={handleBack}>
            Back
          </button>
          {!isNew && (
            <button type="button" className="danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button
            type="button"
            className="primary"
            onClick={handleSave}
            disabled={saving || (!dirty && !isNew)}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <label className="scene-name-field">
        Scene name
        <input
          value={scene.name}
          placeholder="Untitled scene"
          autoFocus={isNew}
          onChange={(e) => update({ ...scene, name: e.target.value })}
        />
      </label>

      {scene.type === "social" && (
        <SocialEditor scene={scene} onChange={update} />
      )}
      {scene.type === "combat" && (
        <CombatEditor scene={scene} onChange={update} />
      )}
      {scene.type === "exploration" && (
        <ExplorationEditor scene={scene} onChange={update} />
      )}
    </div>
  );
}
