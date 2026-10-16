import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router";

export const TOOLBAR_HEIGHT = 48;

export default function Header() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar variant="dense" sx={{ minHeight: TOOLBAR_HEIGHT }}>
        <Box component={Link} to="/" sx={{ textDecoration: "none" }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, letterSpacing: 0, color: "#5aa348" }}
          >
            Daggerheart GM Tools
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
