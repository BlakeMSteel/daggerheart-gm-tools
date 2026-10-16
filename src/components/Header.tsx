import { AppBar, Box, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { GiCrossedSwords } from "react-icons/gi";
import { Link, useLocation } from "react-router";
import MobileNavMenu from "./MobileNavMenu";

export const TOOLBAR_HEIGHT = 48;

type TabValue = "edit" | "view";

const TAB_ITEMS: { value: TabValue; label: string; to: string }[] = [
  { value: "edit", label: "Edit", to: "/edit" },
  { value: "view", label: "View", to: "/view" },
];

export default function Header() {
  const { pathname } = useLocation();
  const activeTab =
    TAB_ITEMS.find((t) => pathname.startsWith(t.to))?.value ?? false;

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar
        variant="dense"
        disableGutters
        sx={{ pl: 2, minHeight: TOOLBAR_HEIGHT }}
      >
        <Box
          component="a"
          href="https://blakesteel.com"
          sx={{
            display: { xs: "none", sm: "block" },
            mr: 3,
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, letterSpacing: 0, color: "#5aa348" }}
          >
            Daggerheart GM Tools
          </Typography>
        </Box>
        <Box
          component="a"
          href="https://blakesteel.com"
          sx={{
            display: { xs: "flex", sm: "none" },
            mr: 2,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <GiCrossedSwords size={24} color="#5aa348" />
        </Box>
        <Tabs
          value={activeTab}
          textColor="primary"
          indicatorColor="primary"
          sx={{ display: { xs: "none", sm: "flex" } }}
        >
          {TAB_ITEMS.map((t) => (
            <Tab
              key={t.value}
              label={t.label}
              value={t.value}
              component={Link}
              to={t.to}
            />
          ))}
        </Tabs>
        <MobileNavMenu tabs={TAB_ITEMS} activeTab={activeTab} />
      </Toolbar>
    </AppBar>
  );
}
