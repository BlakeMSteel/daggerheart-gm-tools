import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { getScene } from "../scenes/db";
import { SCENE_TYPE_LABELS, type Scene } from "../scenes/types";

// Placeholder: display mode will be designed later.
export function SceneDisplayPage() {
  const { id } = useParams();
  const [scene, setScene] = useState<Scene | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScene(id).then((s) => setScene(s ?? null));
  }, [id]);

  if (scene === undefined) return <p className="page muted">Loading…</p>;
  if (scene === null) {
    return (
      <div className="page">
        <p>Scene not found.</p>
        <Link to="/">Back to scenes</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>{scene.name || "Untitled scene"}</h1>
        <div className="button-row">
          <Link className="button" to="/">
            Back
          </Link>
          <Link className="button primary" to={`/scenes/${scene.id}/edit`}>
            Edit
          </Link>
        </div>
      </div>
      <p className="muted">
        {SCENE_TYPE_LABELS[scene.type]} scene — display mode coming soon.
      </p>
    </div>
  );
}
