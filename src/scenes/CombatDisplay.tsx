import { useState } from "react";
import {
  Box,
  ButtonBase,
  IconButton,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  EXTRA_CONDITIONS,
  STANDARD_CONDITIONS,
  type ConditionDef,
} from "./conditions";
import type { CombatScene, Enemy } from "./types";
import { useObjectUrl } from "./useObjectUrl";

const COLUMNS = 4;
/** Height in px of the soft edge where the name shade fades into the art. */
const FADE = 64;
const SHADE = "rgba(0, 0, 0, 0.7)";
type StandardCondition = (typeof STANDARD_CONDITIONS)[number]["key"];

const CONDITION_ICON_SIZE = 32;
const ACTIVE_BG = "rgba(90, 163, 72, 0.16)";

const HP_COLOR = "#e53935";
const STRESS_COLOR = "#42a5f5";

function formatStat(value: number | null | undefined): string {
  return value == null ? "—" : String(value);
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: "center", minWidth: 0 }}>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
        {value}
      </Typography>
    </Box>
  );
}

const CIRCLE = 22;
const DOT = 10;

/**
 * A labelled row of circles, one per point (e.g. HP or Stress). Clicking an empty
 * circle marks it and every circle before it; clicking a marked circle clears it
 * and every circle after it.
 */
function Track({
  label,
  count,
  marked,
  onChange,
  color,
}: {
  label: string;
  count: number | null;
  marked: number;
  onChange: (marked: number) => void;
  color: string;
}) {
  if (!count) return null;

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
      <Typography
        variant="caption"
        sx={{
          width: 48,
          flexShrink: 0,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Box
        role="group"
        aria-label={`${label}: ${marked} of ${count} marked`}
        sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}
      >
        {Array.from({ length: count }, (_, i) => {
          const filled = i < marked;
          return (
            <ButtonBase
              key={i}
              onClick={() => onChange(filled ? i : i + 1)}
              aria-label={`${label} ${i + 1}`}
              aria-pressed={filled}
              sx={{
                width: CIRCLE,
                height: CIRCLE,
                borderRadius: "50%",
                border: 2,
                borderColor: color,
                "&.Mui-focusVisible": {
                  outline: 2,
                  outlineColor: color,
                  outlineOffset: 2,
                },
              }}
            >
              {/* Filled: a solid dot inside the ring, with a small gap between them. */}
              <Box
                sx={{
                  width: DOT,
                  height: DOT,
                  borderRadius: "50%",
                  bgcolor: color,
                  transform: filled ? "scale(1)" : "scale(0)",
                  transition: "transform 150ms ease",
                }}
              />
            </ButtonBase>
          );
        })}
      </Box>
    </Stack>
  );
}

function EnemyCard({ enemy }: { enemy: Enemy }) {
  const url = useObjectUrl(enemy.image);
  const name = enemy.name || "Unnamed enemy";
  // Marked HP, Stress and conditions are table state for this viewing only and aren't saved.
  const [hpMarked, setHpMarked] = useState(0);
  const [stressMarked, setStressMarked] = useState(0);
  const [conditions, setConditions] = useState<ReadonlySet<StandardCondition>>(
    new Set(),
  );
  // Extra conditions in the order they were added; present means active.
  const [extras, setExtras] = useState<readonly ConditionDef[]>([]);
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);

  const addExtra = (condition: ConditionDef) => {
    setExtras((prev) => [...prev, condition]);
    setPickerAnchor(null);
  };
  const removeExtra = (key: string) =>
    setExtras((prev) => prev.filter((c) => c.key !== key));

  const toggleCondition = (condition: StandardCondition) =>
    setConditions((prev) => {
      const next = new Set(prev);
      if (next.has(condition)) next.delete(condition);
      else next.add(condition);
      return next;
    });

  // An enemy with all its Stress marked is Vulnerable until some Stress is cleared.
  const fullStress = !!enemy.stress && stressMarked >= enemy.stress;
  const isForced = (condition: StandardCondition) =>
    condition === "vulnerable" && fullStress;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        minHeight: 0,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: 6,
      }}
    >
      {/* Art takes whatever height the stats don't need. */}
      <Box
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 120,
          bgcolor: "grey.900",
        }}
      >
        {url && (
          <Box
            component="img"
            src={url}
            alt={name}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            // Padding on top matches the fade, so the text always sits on full shade.
            pt: `${FADE}px`,
            px: 2,
            pb: 1.5,
            color: "#fff",
            background: `linear-gradient(to top, ${SHADE} calc(100% - ${FADE}px), transparent)`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {name}
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1.5} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
          }}
        >
          <Stat label="Difficulty" value={formatStat(enemy.difficulty)} />
          <Stat
            label="Thresholds"
            value={[
              enemy.minorThreshold,
              enemy.majorThreshold,
              enemy.severeThreshold,
            ]
              .map(formatStat)
              .join(" / ")}
          />
        </Box>
        {/*
          HP and Stress on the left, condition toggles on the right. The toggles are one
          flex item, so when the circles' full single-line width doesn't fit beside them,
          the whole group wraps below together. Only then do the circles wrap, and only
          if they're wider than the card.
        */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Stack spacing={1.5} sx={{ flex: "1 1 auto" }}>
            <Track
              label="HP"
              count={enemy.hp}
              marked={hpMarked}
              onChange={setHpMarked}
              color={HP_COLOR}
            />
            <Track
              label="Stress"
              count={enemy.stress}
              marked={stressMarked}
              onChange={setStressMarked}
              color={STRESS_COLOR}
            />
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            useFlexGap
            sx={{ flexWrap: "wrap", justifyContent: "flex-end", ml: "auto" }}
          >
            {STANDARD_CONDITIONS.map(({ key, label, Icon }) => {
              const forced = isForced(key);
              const active = forced || conditions.has(key);
              return (
                <Tooltip
                  key={key}
                  title={forced ? `${label} (full Stress)` : label}
                >
                  <IconButton
                    // Not `disabled`, so the tooltip explaining why still shows.
                    onClick={() => !forced && toggleCondition(key)}
                    aria-label={label}
                    aria-pressed={active}
                    aria-disabled={forced}
                    sx={{
                      cursor: forced ? "default" : "pointer",
                      color: active ? "primary.main" : "text.disabled",
                      bgcolor: active ? ACTIVE_BG : "transparent",
                    }}
                  >
                    <Icon size={CONDITION_ICON_SIZE} />
                  </IconButton>
                </Tooltip>
              );
            })}
            {extras.map(({ key, label, Icon }) => (
              <Tooltip key={key} title={`${label} (click to remove)`}>
                <IconButton
                  onClick={() => removeExtra(key)}
                  aria-label={`Remove ${label}`}
                  sx={{ color: "primary.main", bgcolor: ACTIVE_BG }}
                >
                  <Icon size={CONDITION_ICON_SIZE} />
                </IconButton>
              </Tooltip>
            ))}
            {extras.length < EXTRA_CONDITIONS.length && (
              <Tooltip title="Add condition">
                <IconButton
                  onClick={(e) => setPickerAnchor(e.currentTarget)}
                  aria-label="Add condition"
                  aria-haspopup="dialog"
                  sx={{ color: "text.secondary" }}
                >
                  <AddIcon sx={{ fontSize: CONDITION_ICON_SIZE }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          <Popover
            open={!!pickerAnchor}
            anchorEl={pickerAnchor}
            onClose={() => setPickerAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, auto)",
                gap: 0.5,
                p: 1,
              }}
            >
              {EXTRA_CONDITIONS.map((condition) => {
                const added = extras.some((c) => c.key === condition.key);
                const { Icon } = condition;
                return (
                  <Tooltip key={condition.key} title={condition.label}>
                    {/* Span keeps the tooltip working on already-added (disabled) icons. */}
                    <span>
                      <IconButton
                        onClick={() => addExtra(condition)}
                        disabled={added}
                        aria-label={`Add ${condition.label}`}
                      >
                        <Icon size={CONDITION_ICON_SIZE} />
                      </IconButton>
                    </span>
                  </Tooltip>
                );
              })}
            </Box>
          </Popover>
        </Box>
      </Stack>
    </Box>
  );
}

/** Enemy cards in rows of four, filling the view area. */
export function CombatDisplay({ scene }: { scene: CombatScene }) {
  if (scene.enemies.length === 0) {
    return (
      <Typography color="text.secondary">
        This scene has no enemies yet.
      </Typography>
    );
  }

  // Fewer than four enemies: use fewer, wider columns so the cards still fill the width.
  const columns = Math.min(scene.enemies.length, COLUMNS);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: {
          xs: `repeat(${Math.min(columns, 2)}, minmax(0, 1fr))`,
          sm: `repeat(${columns}, minmax(0, 1fr))`,
        },
        gridAutoRows: { xs: "minmax(360px, 1fr)", sm: "minmax(0, 1fr)" },
        gap: 3,
        p: 3,
        overflowY: { xs: "auto", sm: "hidden" },
      }}
    >
      {scene.enemies.map((enemy) => (
        <EnemyCard key={enemy.id} enemy={enemy} />
      ))}
    </Box>
  );
}
