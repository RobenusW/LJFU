import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Toolbar,
} from "@mui/material";
import NavBar from "../../NavBar";
import { axiosWithCredentials, SEARCH_API } from "./constants";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([{ title: "", description: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosWithCredentials.post(SEARCH_API, { query });
      setResults(response.data.results || []);
    } catch (err) {
      setError("Check API key amount");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ zIndex: 5000, position: "relative" }}>
        <NavBar />
      </div>
      <Toolbar />
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          backgroundColor: "#121212", // Dark background
          borderRadius: 2,
          padding: 3,
          boxShadow: 3,
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "primary.light" }}
        >
          Discover CS Projects Relevant to You
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Enter your search query"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                style: { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "gray" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white",
                  },
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.light",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearch}
              disabled={loading || !query}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Search"
              )}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {results.length > 1 && (
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {results.map((result, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#1E1E1E",
                    color: "white",
                    boxShadow: 3,
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "primary.light" }}
                    >
                      {result.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {result.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {results.length === 0 && !loading && !error && (
          <Typography
            variant="body1"
            align="center"
            sx={{ mt: 4, color: "white" }}
          >
            No results to display. Start your search above.
          </Typography>
        )}
      </Container>
    </div>
  );
}
