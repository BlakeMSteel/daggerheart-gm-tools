import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Link, Outlet, useParams } from "react-router";
import FearTracker, { MAX_FEAR } from "../components/FearTracker";
import ShareFearDialog from "../components/ShareFearDialog";
import { newShareCode, useFearChannel } from "../sync/fearChannel";
import { listScenes } from "../scenes/db";
import {
  SCENE_TYPE_COLORS,
  SCENE_TYPE_LABELS,
  type Scene,
} from "../scenes/types";

const SIDEBAR_WIDTH = 280;
const RAIL_WIDTH = 56;
const COLLAPSED_KEY = "view-sidebar-collapsed";
const FEAR_KEY = "gm-fear";
const SHARE_CODE_KEY = "fear-share-code";

function loadShareCode(): string | null {
  try {
    return localStorage.getItem(SHARE_CODE_KEY);
  } catch {
    return null;
  }
}

function saveShareCode(code: string) {
  try {
    localStorage.setItem(SHARE_CODE_KEY, code);
  } catch {
    // storage unavailable; a new code is made after a reload
  }
}

function loadFear(): number {
  try {
    const fear = Number(localStorage.getItem(FEAR_KEY));
    return Number.isInteger(fear) ? Math.min(Math.max(fear, 0), MAX_FEAR) : 0;
  } catch {
    return 0;
  }
}

function saveFear(fear: number) {
  try {
    localStorage.setItem(FEAR_KEY, String(fear));
  } catch {
    // storage unavailable; Fear just won't survive a reload
  }
}

function loadCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "true";
  } catch {
    return false;
  }
}

function saveCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed));
  } catch {
    // storage unavailable; the sidebar just won't remember its state
  }
}

/** /view and /view/:id — scene selection in a collapsible sidebar beside the selected scene. */
export function ViewLayout() {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [scenes, setScenes] = useState<Scene[] | null>(null);
  const [collapsed, setCollapsed] = useState(loadCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Fear is session-wide, so it lives here (not per scene) and survives reloads.
  const [fear, setFearState] = useState(loadFear);
  const updateFear = (change: (fear: number) => number) =>
    setFearState((prev) => {
      const next = Math.min(Math.max(change(prev), 0), MAX_FEAR);
      saveFear(next);
      return next;
    });

  // Players with the share link add Fear here; this page owns the total.
  const [shareCode, setShareCode] = useState(loadShareCode);
  const [shareOpen, setShareOpen] = useState(false);
  const { status: shareStatus, send } = useFearChannel(
    shareCode,
    (message, reply) => {
      if (
        message.type === "add" &&
        Number.isInteger(message.amount) &&
        message.amount > 0
      ) {
        updateFear((f) => f + message.amount);
      } else if (message.type === "request") {
        reply({ type: "total", value: fear });
      }
    },
  );

  // Keep players' pages showing the current total.
  useEffect(() => {
    if (shareStatus === "live") send({ type: "total", value: fear });
  }, [fear, shareStatus, send]);

  const createShareCode = () => {
    const code = newShareCode();
    setShareCode(code);
    saveShareCode(code);
  };

  const fearTracker = (
    <Stack sx={{ alignItems: "center" }}>
      <FearTracker value={fear} onChange={(next) => updateFear(() => next)} />
      <Tooltip title="Share Fear with players" placement="right">
        <IconButton
          size="small"
          onClick={() => setShareOpen(true)}
          aria-label="Share Fear with players"
          sx={{
            color: shareStatus === "live" ? "primary.main" : "text.secondary",
          }}
        >
          <GroupsIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );

  useEffect(() => {
    listScenes().then(setScenes);
  }, []);

  const open = isMobile ? mobileOpen : !collapsed;
  const setOpen = (next: boolean) => {
    if (isMobile) {
      setMobileOpen(next);
    } else {
      setCollapsed(!next);
      saveCollapsed(!next);
    }
  };

  const sceneList = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pl: 2,
          pr: 1,
          py: 1,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon />}
          component={Link}
          to="/edit"
        >
          Edit
        </Button>
        <Tooltip title="Hide scenes">
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            aria-label="Hide scenes"
          >
            <MenuOpenIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 700, px: 2, pt: 1, pb: 0.5 }}
      >
        Scenes
      </Typography>
      <Box sx={{ flex: 1, overflowY: "auto" }}>
        {scenes === null ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            Loading…
          </Typography>
        ) : scenes.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            No scenes yet. Create one in Edit.
          </Typography>
        ) : (
          <List dense disablePadding>
            {scenes.map((scene) => (
              <ListItemButton
                key={scene.id}
                component={Link}
                to={`/view/${scene.id}`}
                selected={scene.id === id}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderLeft: 3,
                  borderColor: SCENE_TYPE_COLORS[scene.type],
                }}
              >
                <ListItemText
                  primary={scene.name || "Untitled scene"}
                  secondary={SCENE_TYPE_LABELS[scene.type]}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Box sx={{ borderTop: 1, borderColor: "divider", py: 1 }}>
        {fearTracker}
      </Box>
    </Box>
  );

  // Collapsed: a narrow rail holding the menu button, so it never covers the scene.
  const rail = (
    <Stack spacing={2} sx={{ width: RAIL_WIDTH, alignItems: "center", py: 1 }}>
      <Tooltip title="Show scenes" placement="right">
        <IconButton onClick={() => setOpen(true)} aria-label="Show scenes">
          <MenuIcon />
        </IconButton>
      </Tooltip>
      {fearTracker}
    </Stack>
  );

  const expanded = open && !isMobile;

  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <ShareFearDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        code={shareCode}
        status={shareStatus}
        onNewCode={createShareCode}
      />
      {isMobile && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sceneList}
        </Drawer>
      )}
      <Box
        component="nav"
        sx={{
          flexShrink: 0,
          width: expanded ? SIDEBAR_WIDTH : RAIL_WIDTH,
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflow: "hidden",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: theme.transitions.create(["width", "background-color"], {
            duration: 300,
          }),
        }}
      >
        {expanded ? sceneList : rail}
      </Box>
      {/* Positioned so full-bleed displays (e.g. Exploration) can fill this area.
          Clicking here collapses the sidebar; on phones the Drawer's backdrop does the same. */}
      <Box
        onClick={() => expanded && setOpen(false)}
        sx={{ position: "relative", flex: 1, minWidth: 0, p: 3 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
