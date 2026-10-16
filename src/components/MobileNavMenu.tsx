import { useState } from "react";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router";

interface Props<T extends string> {
  tabs: { value: T; label: string; to: string }[];
  activeTab: T | false;
}

export default function MobileNavMenu<T extends string>({
  tabs,
  activeTab,
}: Props<T>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Typography
        variant="button"
        sx={{
          display: { xs: "block", sm: "none" },
          color: "primary.main",
          lineHeight: 1,
        }}
      >
        {tabs.find((t) => t.value === activeTab)?.label}
      </Typography>
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Open navigation menu"
        color="primary"
        sx={{
          display: { xs: "inline-flex", sm: "none" },
          ml: "auto",
          mr: 1,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        variant="menu"
        disableScrollLock
        transitionDuration={{ enter: 0, exit: 0 }}
      >
        {tabs.map((t) => (
          <MenuItem
            key={t.value}
            component={Link}
            to={t.to}
            selected={t.value === activeTab}
            onClick={() => setAnchorEl(null)}
            sx={{
              color: t.value === activeTab ? "primary.main" : "text.secondary",
            }}
          >
            {t.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
