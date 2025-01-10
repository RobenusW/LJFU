import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { FormValues } from "../Talent/ResumeFormat";
import { useNavigate } from "react-router-dom";
import NavBar from "../../NavBar";

export default function DashboardResumes({
  resumes,
}: {
  resumes: FormValues[];
}) {
  const navigate = useNavigate();

  return (
    <div>
      <NavBar />
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {resumes.map((resume, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "#1E1E1E",
                color: "white",
                boxShadow: 3,
                borderRadius: 2,
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "primary.light" }}
                >
                  {resume.generalInfo.firstName} {resume.generalInfo.lastName}
                </Typography>
                <Typography variant="body2" sx={{ color: "white" }}>
                  Email: {resume.generalInfo.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "white", mt: 2 }}>
                  <strong>Skills:</strong>{" "}
                  {resume.programmingLanguages
                    .map((pl) => pl.language)
                    .join(", ")}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  fullWidth
                  onClick={() => {
                    const email = resume.generalInfo.email;
                    navigate(`/resume/details/${email}`);
                  }}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
