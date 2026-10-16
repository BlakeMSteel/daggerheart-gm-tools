export type SceneType = "social" | "combat" | "exploration";

export const SCENE_TYPE_LABELS: Record<SceneType, string> = {
  social: "Social",
  combat: "Combat",
  exploration: "Exploration",
};

export const SCENE_TYPE_COLORS: Record<SceneType, string> = {
  social: "#2a78d6",
  combat: "#eb6834",
  exploration: "#1baf7a",
};

export const MAX_NPCS = 8;
export const MAX_ENEMIES = 4;

export interface Npc {
  id: string;
  name: string;
  title: string;
  image: Blob | null;
}

export interface Enemy {
  id: string;
  name: string;
  image: Blob | null;
  difficulty: number | null;
  hp: number | null;
  stress: number | null;
  // Missing on enemies saved before minor thresholds were added; treat as blank.
  minorThreshold?: number | null;
  majorThreshold: number | null;
  severeThreshold: number | null;
}

interface SceneBase {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface SocialScene extends SceneBase {
  type: "social";
  npcs: Npc[];
}

export interface CombatScene extends SceneBase {
  type: "combat";
  enemies: Enemy[];
}

export interface ExplorationScene extends SceneBase {
  type: "exploration";
  description: string;
  image: Blob | null;
}

export type Scene = SocialScene | CombatScene | ExplorationScene;

export function newNpc(): Npc {
  return { id: crypto.randomUUID(), name: "", title: "", image: null };
}

export function newEnemy(): Enemy {
  return {
    id: crypto.randomUUID(),
    name: "",
    image: null,
    difficulty: null,
    hp: null,
    stress: null,
    minorThreshold: null,
    majorThreshold: null,
    severeThreshold: null,
  };
}

export function newScene(type: SceneType): Scene {
  const now = Date.now();
  const base = {
    id: crypto.randomUUID(),
    name: "",
    createdAt: now,
    updatedAt: now,
  };
  switch (type) {
    case "social":
      return { ...base, type, npcs: [] };
    case "combat":
      return { ...base, type, enemies: [] };
    case "exploration":
      return { ...base, type, description: "", image: null };
  }
}
