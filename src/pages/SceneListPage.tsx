import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { deleteScene, listScenes } from "../scenes/db";
import { SCENE_TYPE_LABELS, type Scene, type SceneType } from "../scenes/types";

export function SceneListPage() {
  const navigate = useNavigate();
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
    <div className="page">
      <div className="page-header">
        <h1>Scenes</h1>
        <div className="button-row">
          {(Object.keys(SCENE_TYPE_LABELS) as SceneType[]).map((type) => (
            <button
              key={type}
              type="button"
              className="primary"
              onClick={() => navigate(`/scenes/new/${type}`)}
            >
              + New {SCENE_TYPE_LABELS[type]} scene
            </button>
          ))}
        </div>
      </div>

      {scenes === null ? (
        <p className="muted">Loading…</p>
      ) : scenes.length === 0 ? (
        <p className="muted">No scenes yet. Create one to get started.</p>
      ) : (
        <ul className="scene-list">
          {scenes.map((scene) => (
            <li key={scene.id} className="scene-list-item">
              <div>
                <span className={`type-badge type-${scene.type}`}>
                  {SCENE_TYPE_LABELS[scene.type]}
                </span>
                <span className="scene-name">
                  {scene.name || "Untitled scene"}
                </span>
              </div>
              <div className="button-row">
                <Link className="button" to={`/scenes/${scene.id}`}>
                  View
                </Link>
                <Link className="button" to={`/scenes/${scene.id}/edit`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDelete(scene)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
