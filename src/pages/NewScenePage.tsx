import { useState } from "react";
import { SceneForm } from "../scenes/SceneForm";
import { newScene } from "../scenes/types";

/** /edit/new — creates a scene, starting as Social. */
export function NewScenePage() {
  const [scene] = useState(() => newScene("social"));
  return <SceneForm initialScene={scene} isNew />;
}
