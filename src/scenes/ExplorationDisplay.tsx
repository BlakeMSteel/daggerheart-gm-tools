import { Box, Typography } from "@mui/material";
import type { ExplorationScene } from "./types";
import { useObjectUrl } from "./useObjectUrl";

/** Width in px of the soft edge where the text panel fades into the image. */
const FADE = 96;
const FADE_TOP = `linear-gradient(to bottom, transparent, #000 ${FADE}px)`;
const FADE_LEFT = `linear-gradient(to right, transparent, #000 ${FADE}px)`;

/** Location image filling the view area, with the name and description in the bottom-right corner. */
export function ExplorationDisplay({ scene }: { scene: ExplorationScene }) {
  const url = useObjectUrl(scene.image);

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        bgcolor: "#000",
      }}
    >
      {url && (
        <Box
          component="img"
          src={url}
          alt={scene.name || "Location"}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          right: 0,
          bottom: 0,
          left: { xs: 0, sm: "auto" },
          width: { sm: 480 + FADE },
          maxHeight: "60%",
          overflowY: "auto",
          // Padding on the faded sides matches the fade, so the text itself stays fully opaque.
          pt: `${FADE}px`,
          pl: { xs: 2.5, sm: `${FADE}px` },
          pr: 3,
          pb: 3,
          bgcolor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(6px)",
          color: "#fff",
          // Fade the panel into the image along its top and left edges (top only on phones).
          maskImage: {
            xs: FADE_TOP,
            sm: `${FADE_LEFT}, ${FADE_TOP}`,
          },
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {scene.name || "Untitled scene"}
        </Typography>
        {scene.description && (
          <Typography
            sx={{
              mt: 1,
              whiteSpace: "pre-wrap",
              color: "rgba(255, 255, 255, 0.85)",
            }}
          >
            {scene.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
