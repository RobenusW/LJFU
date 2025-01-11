import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  People,
  BusinessCenter,
  Visibility,
  Message,
  Edit,
  Add,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Business } from "./businessInterface";
import NavBar from "../../NavBar";

// Mock data for demonstration
const recentApplications = [
  { id: 1, name: "John Doe", role: "Software Engineer", date: "2 hours ago" },
  { id: 2, name: "Jane Smith", role: "Product Manager", date: "5 hours ago" },
  { id: 3, name: "Mike Johnson", role: "UX Designer", date: "1 day ago" },
];

const metrics = [
  { title: "Profile Views", value: "2.3k", icon: Visibility, color: "#2196f3" },
  { title: "Applications", value: "48", icon: People, color: "#4caf50" },
  { title: "Active Jobs", value: "12", icon: BusinessCenter, color: "#ff9800" },
  { title: "Messages", value: "28", icon: Message, color: "#e91e63" },
];

export default function BusinessDashboard() {
  const theme = useTheme();
  const [businessProfile, setBusinessProfile] = useState<Business | null>(null);

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching business profile:", error);
        return;
      }

      setBusinessProfile(data);
    };

    fetchBusinessProfile();
  }, []);

  return (
    <>
      <NavBar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.grey[100],
          pt: "80px",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Welcome back, {businessProfile?.business_name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here's what's happening with your business today
            </Typography>
          </Box>

          {/* Metrics Grid */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {metrics.map((metric, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar sx={{ bgcolor: metric.color, mr: 2 }}>
                        <metric.icon />
                      </Avatar>
                      <Typography variant="h6" component="div">
                        {metric.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {metric.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Main Content Grid */}
          <Grid container spacing={3}>
            {/* Profile Overview */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Profile Overview
                  </Typography>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                </Box>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                  {businessProfile?.logo ? (
                    <Avatar
                      src={businessProfile.logo}
                      sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}>
                      {businessProfile?.business_name?.[0]}
                    </Avatar>
                  )}
                  <Typography variant="h6">
                    {businessProfile?.business_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {businessProfile?.description}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  sx={{ mb: 2 }}
                >
                  Post New Job
                </Button>
              </Paper>
            </Grid>

            {/* Recent Applications */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" gutterBottom>
                  Recent Applications
                </Typography>
                <List>
                  {recentApplications.map((application, index) => (
                    <Box key={application.id}>
                      <ListItem
                        secondaryAction={
                          <Typography variant="caption" color="text.secondary">
                            {application.date}
                          </Typography>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar>{application.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={application.name}
                          secondary={application.role}
                        />
                      </ListItem>
                      {index < recentApplications.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button color="primary">View All Applications</Button>
                </Box>
              </Paper>
            </Grid>

            {/* Activity Chart */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <BarChart sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6">Profile Activity</Typography>
                </Box>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    Activity chart will be implemented here
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
