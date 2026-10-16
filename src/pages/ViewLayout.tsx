import { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Link, Outlet, useParams } from "react-router";
import { TOOLBAR_HEIGHT } from "../components/Header";
import { listScenes } from "../scenes/db";
import {
  SCENE_TYPE_COLORS,
  SCENE_TYPE_LABELS,
  type Scene,
} from "../scenes/types";

const SIDEBAR_WIDTH = 280;
const COLLAPSED_KEY = "view-sidebar-collapsed";

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
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Scenes
        </Typography>
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
    </Box>
  );

  return (
    <Box
      sx={{ display: "flex", minHeight: `calc(100dvh - ${TOOLBAR_HEIGHT}px)` }}
    >
      {isMobile ? (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)}>
          {sceneList}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            flexShrink: 0,
            width: open ? SIDEBAR_WIDTH : 0,
            position: "sticky",
            top: TOOLBAR_HEIGHT,
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`,
            overflow: "hidden",
            borderRight: open ? 1 : 0,
            borderColor: "divider",
            bgcolor: "background.paper",
            transition: theme.transitions.create(
              ["width", "background-color"],
              { duration: 300 },
            ),
          }}
        >
          {sceneList}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0, p: 3 }}>
        {!open && (
          <Tooltip title="Show scenes">
            <IconButton
              onClick={() => setOpen(true)}
              aria-label="Show scenes"
              sx={{
                position: "fixed",
                top: TOOLBAR_HEIGHT + 8,
                left: 8,
                zIndex: (theme) => theme.zIndex.speedDial,
                bgcolor: "background.paper",
                boxShadow: 3,
                "&:hover": { bgcolor: "background.paper", boxShadow: 6 },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}
