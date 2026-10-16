import { createTheme, type ThemeOptions } from "@mui/material";

const baseOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#5aa348",
    },
  },
  components: {
    // Paper sets its own transition (box-shadow only), which would block the global theme fade.
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          transition: theme.transitions.create(
            ["box-shadow", "background-color", "color"],
            { duration: 300 },
          ),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
};

export const lightTheme = createTheme(baseOptions);

// View mode is used at the table, so it runs dark.
export const darkTheme = createTheme({
  ...baseOptions,
  palette: { ...baseOptions.palette, mode: "dark" },
});
