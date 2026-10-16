import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router";
import { CombatDisplay } from "../scenes/CombatDisplay";
import { ExplorationDisplay } from "../scenes/ExplorationDisplay";
import { SocialDisplay } from "../scenes/SocialDisplay";
import { getScene } from "../scenes/db";
import type { Scene } from "../scenes/types";

/** /view/:id — shows a scene for the table. */
export function SceneDisplayPage() {
  const { id } = useParams();
  const [scene, setScene] = useState<Scene | null | undefined>(undefined);

  useEffect(() => {
    if (id) getScene(id).then((s) => setScene(s ?? null));
  }, [id]);

  if (scene === undefined)
    return <Typography color="text.secondary">Loading…</Typography>;
  if (scene === null) return <Typography>Scene not found.</Typography>;

  switch (scene.type) {
    case "exploration":
      return <ExplorationDisplay scene={scene} />;
    // Keyed so table state (e.g. who is present) resets when switching scenes.
    case "social":
      return <SocialDisplay key={scene.id} scene={scene} />;
    case "combat":
      return <CombatDisplay key={scene.id} scene={scene} />;
  }
}
