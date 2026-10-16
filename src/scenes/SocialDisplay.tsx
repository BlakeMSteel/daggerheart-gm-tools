import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import type { Npc, SocialScene } from "./types";
import { useObjectUrl } from "./useObjectUrl";

const COLUMNS = 4;
/** Height in px of the soft edge where a card's caption shade fades into the art. */
const FADE = 64;
const SHADE = "rgba(0, 0, 0, 0.7)";
const ABSENT_OPACITY = 0.35;

interface NpcCardProps {
  npc: Npc;
  present: boolean;
  onTogglePresent: () => void;
}

function NpcCard({ npc, present, onTogglePresent }: NpcCardProps) {
  const url = useObjectUrl(npc.image);
  const name = npc.name || "Unnamed NPC";

  return (
    <Box sx={{ position: "relative", minWidth: 0, minHeight: 0 }}>
      {/* The card itself fades when the NPC is absent; the toggle button stays fully visible. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "grey.900",
          boxShadow: 6,
          opacity: present ? 1 : ABSENT_OPACITY,
          transition: "opacity 300ms ease",
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
            pl: 2,
            // Leave room for the presence button in the corner.
            pr: 7,
            pb: 1.5,
            color: "#fff",
            background: `linear-gradient(to top, ${SHADE} calc(100% - ${FADE}px), transparent)`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {name}
          </Typography>
          {npc.title && (
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.85)" }}
            >
              {npc.title}
            </Typography>
          )}
        </Box>
      </Box>
      <Tooltip title={present ? "Mark as not present" : "Mark as present"}>
        <IconButton
          onClick={onTogglePresent}
          aria-label={`${name} present`}
          aria-pressed={present}
          sx={{
            position: "absolute",
            right: 8,
            bottom: 8,
            color: present ? "primary.main" : "rgba(255, 255, 255, 0.85)",
            bgcolor: "rgba(0, 0, 0, 0.5)",
            "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
          }}
        >
          {present ? <PersonIcon /> : <PersonOffIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

/**
 * NPC cards in rows of four, filling the view area. Every NPC starts not present;
 * presence is table state for this viewing only and isn't saved with the scene.
 */
export function SocialDisplay({ scene }: { scene: SocialScene }) {
  const [presentIds, setPresentIds] = useState<ReadonlySet<string>>(new Set());

  const togglePresent = (id: string) =>
    setPresentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (scene.npcs.length === 0) {
    return (
      <Typography color="text.secondary">
        This scene has no NPCs yet.
      </Typography>
    );
  }

  // Fewer than four NPCs: use fewer, wider columns so the cards still fill the width.
  const columns = Math.min(scene.npcs.length, COLUMNS);

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
        gridAutoRows: { xs: "minmax(240px, 1fr)", sm: "minmax(0, 1fr)" },
        gap: 3,
        p: 3,
        overflowY: { xs: "auto", sm: "hidden" },
      }}
    >
      {scene.npcs.map((npc) => (
        <NpcCard
          key={npc.id}
          npc={npc}
          present={presentIds.has(npc.id)}
          onTogglePresent={() => togglePresent(npc.id)}
        />
      ))}
    </Box>
  );
}
