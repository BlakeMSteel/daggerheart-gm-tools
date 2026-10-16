import { Box, Typography } from "@mui/material";
import type { ExplorationScene } from "./types";
import { useObjectUrl } from "./useObjectUrl";

/** Width in px of the soft edge where the text panel fades into the image. */
const FADE = 96;
const SHADE = "rgba(0, 0, 0, 0.7)";

// The panel's shading is drawn with background layers rather than a CSS mask, so the fade
// works in every browser. Desktop: solid body, a strip fading up along the top, a strip
// fading right along the right edge, and a rounded fade in the top-right corner joining them.
const SHADE_DESKTOP = {
  backgroundImage: [
    `radial-gradient(circle at bottom left, ${SHADE}, transparent ${FADE}px)`,
    `linear-gradient(to top, ${SHADE}, transparent)`,
    `linear-gradient(to right, ${SHADE}, transparent)`,
    `linear-gradient(${SHADE}, ${SHADE})`,
  ].join(", "),
  backgroundPosition: "top right, top left, bottom right, bottom left",
  backgroundSize: [
    `${FADE}px ${FADE}px`,
    `calc(100% - ${FADE}px) ${FADE}px`,
    `${FADE}px calc(100% - ${FADE}px)`,
    `calc(100% - ${FADE}px) calc(100% - ${FADE}px)`,
  ].join(", "),
  backgroundRepeat: "no-repeat",
};

// Phones: the panel spans the full width, so only the top edge fades.
const SHADE_MOBILE = {
  backgroundImage: `linear-gradient(to top, ${SHADE}, transparent), linear-gradient(${SHADE}, ${SHADE})`,
  backgroundPosition: "top left, bottom left",
  backgroundSize: `100% ${FADE}px, 100% calc(100% - ${FADE}px)`,
  backgroundRepeat: "no-repeat",
};

/** Location image filling the view area, with the name and description in the bottom-left corner. */
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
        sx={(theme) => ({
          position: "absolute",
          left: 0,
          bottom: 0,
          right: { xs: 0, sm: "auto" },
          width: { sm: 480 + FADE },
          maxHeight: "60%",
          overflowY: "auto",
          // Padding on the faded sides matches the fade, so the text always sits on full shade.
          pt: `${FADE}px`,
          pr: { xs: 2.5, sm: `${FADE}px` },
          pl: 3,
          pb: 3,
          color: "#fff",
          ...SHADE_MOBILE,
          [theme.breakpoints.up("sm")]: SHADE_DESKTOP,
        })}
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
