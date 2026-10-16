import type { IconType } from "react-icons";
import {
  GiAngelWings,
  GiCrackedShield,
  GiCursedStar,
  GiExitDoor,
  GiFlame,
  GiHood,
  GiKnockout,
  GiManacles,
  GiPoisonBottle,
  GiScales,
  GiSlime,
  GiSnowflake1,
  GiSpiralBloom,
  GiTargeted,
  GiTreeRoots,
  GiWolfTrap,
} from "react-icons/gi";

export interface ConditionDef {
  key: string;
  label: string;
  Icon: IconType;
}

/** Daggerheart's standard conditions, always shown on each enemy. */
export const STANDARD_CONDITIONS = [
  { key: "vulnerable", label: "Vulnerable", Icon: GiCrackedShield },
  { key: "hidden", label: "Hidden", Icon: GiHood },
  { key: "restrained", label: "Restrained", Icon: GiManacles },
] as const satisfies readonly ConditionDef[];

/**
 * Other conditions in the game, added to an enemy from the picker. Icons are chosen to
 * stay distinct from each other and from the standard conditions (no shields, hoods or
 * restraints).
 */
export const EXTRA_CONDITIONS: readonly ConditionDef[] = [
  { key: "poisoned", label: "Poisoned", Icon: GiPoisonBottle },
  { key: "cursed", label: "Cursed", Icon: GiCursedStar },
  { key: "ignited", label: "Ignited", Icon: GiFlame },
  { key: "exiled", label: "Exiled", Icon: GiExitDoor },
  { key: "protected", label: "Protected", Icon: GiAngelWings },
  { key: "entranced", label: "Entranced", Icon: GiSpiralBloom },
  { key: "enveloped", label: "Enveloped", Icon: GiSlime },
  { key: "dazed", label: "Dazed", Icon: GiKnockout },
  { key: "rooted", label: "Rooted", Icon: GiTreeRoots },
  { key: "marked", label: "Marked", Icon: GiTargeted },
  { key: "chilled", label: "Chilled", Icon: GiSnowflake1 },
  { key: "trapped", label: "Trapped", Icon: GiWolfTrap },
  { key: "guilty", label: "Guilty", Icon: GiScales },
];
