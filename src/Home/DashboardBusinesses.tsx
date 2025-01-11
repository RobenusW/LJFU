import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NavBar from "../NavBar";
import { supabase } from "../Account/supabase";
import { useEffect, useState } from "react";
import { Business } from "../Account/Business/businessInterface";

const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f5",
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: "1rem",
    },
    h5: {
      fontWeight: 500,
      marginBottom: "0.5rem",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "28px",
            backgroundColor: "white",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#90caf9",
              },
            },
          },
        },
      },
    },
  },
});

export default function DashboardBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .order("business_name", { ascending: true });

        if (error) {
          throw error;
        }

        setBusinesses(data || []);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.business_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      business.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-gray-50" style={{ marginTop: "80px" }}>
        <NavBar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Search Bar */}
          <Box sx={{ maxWidth: "600px", mx: "auto", mb: 6 }}>
            <TextField
              fullWidth
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "text.secondary", ml: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                },
              }}
            />
          </Box>

          {/* Companies List */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {filteredBusinesses.map((business) => (
              <Paper
                key={business.user_id}
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderColor: "primary.main",
                  },
                  cursor: "pointer",
                }}
              >
                {/* Logo Section */}
                <Box
                  sx={{
                    width: 160,
                    height: 160,
                    flexShrink: 0,
                    backgroundColor: "grey.50",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    mr: 4,
                  }}
                >
                  {business.logo ? (
                    <img
                      src={business.logo}
                      alt={`${business.business_name} logo`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: "16px",
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h5"
                      color="text.secondary"
                      sx={{ opacity: 0.5 }}
                    >
                      No Logo
                    </Typography>
                  )}
                </Box>

                {/* Content Section */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                      mb: 1,
                    }}
                  >
                    {business.business_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.6,
                      maxWidth: "800px",
                    }}
                  >
                    {business.description || "No description available"}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
}
