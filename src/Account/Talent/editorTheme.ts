import { createTheme } from "@mui/material/styles";

export const editorTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    primary: {
      main: "#2196F3",
    },
    secondary: {
      main: "#FF5722",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#BBBBBB",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle2: {
      color: "#BBBBBB",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            backgroundColor: "#2E2E2E",
            color: "#FFFFFF",
            padding: "10px",
          },
          "& .MuiInputLabel-root": {
            color: "#AAAAAA",
          },
          marginBottom: "16px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "8px 0",
        },
      },
    },
  },
});
