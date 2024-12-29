import {
  Typography,
  Grid,
  Card,
  CardContent,
  CssBaseline,
  Container,
  createTheme,
  ThemeProvider,
  Toolbar,
} from "@mui/material";
import NavBar from "../NavBar";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff9800",
    },
    background: {
      default: "#f4f6f8",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default function Dashboard({ companies }: { companies: string[] }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ zIndex: 5000, position: "relative" }}>
        <NavBar />
      </div>

      {/* Add a Toolbar spacer to offset AppBar height */}
      <Toolbar />

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {companies.map((company, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "150px",
                  borderRadius: 2,
                  boxShadow: 3,
                  "&:hover": { boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontWeight: "medium", color: "primary.dark" }}
                  >
                    {company}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
