import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Toolbar,
} from "@mui/material";
import { FormValues } from "../Account/Talent/ResumeFormat";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { findResumeByEmailAddress } from "../Account/Talent/resumeClient";
import { useSelector } from "react-redux";
import NavBar from "../NavBar";
import { Job } from "../Account/Talent/Interfaces/jobInterface";

export default function ResumeDetails() {
  const [resume, setResume] = useState<FormValues | null>(null);
  const { email } = useParams();
  const currentUser = useSelector((state: any) => state.account.currentUser);

  const fetchResume = async () => {
    try {
      const resume = await findResumeByEmailAddress(email);
      setResume(resume);
      console.log("Resume found", resume);
    } catch (error) {
      console.error("Error fetching resumes", error);
    }
  };

  useEffect(() => {
    fetchResume();
  }, [email]);

  if (!resume) {
    return (
      <Box p={3}>
        <Typography variant="h5" align="center">
          No resume data available
        </Typography>
      </Box>
    );
  }

  const {
    generalInfo,
    education,
    programmingLanguages,
    technologies,
    projects,
    employment,
  } = resume;

  return (
    <div>
      <div style={{ zIndex: 5000, position: "relative" }}>
        <NavBar />
      </div>
      <Toolbar />

      <Box p={3}>
        <Typography variant="h4" align="center" gutterBottom>
          {generalInfo.firstName} {generalInfo.lastName}'s Resume
        </Typography>

        {/* General Info */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              General Information
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {generalInfo.email}
            </Typography>
            <Typography variant="body1">
              <strong>Phone:</strong> {generalInfo.phone}
            </Typography>
            <Typography variant="body1">
              <strong>Location:</strong> {generalInfo.city}, {generalInfo.state}
            </Typography>
            {generalInfo.github && (
              <Typography variant="body1">
                <strong>GitHub:</strong> {generalInfo.github}
              </Typography>
            )}
            {generalInfo.portfolio && (
              <Typography variant="body1">
                <strong>Portfolio:</strong> {generalInfo.portfolio}
              </Typography>
            )}
            {generalInfo.additionalLink && (
              <Typography variant="body1">
                <strong>Additional Links:</strong> {generalInfo.additionalLink}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Education
            </Typography>
            <List>
              {education.map((edu: any, index: number) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={edu.university}
                      secondary={
                        <>
                          <Typography variant="body2">
                            <strong>Major:</strong> {edu.major}
                          </Typography>
                          {edu.concentration && (
                            <Typography variant="body2">
                              <strong>Concentration:</strong>{" "}
                              {edu.concentration}
                            </Typography>
                          )}
                          {edu.gpa && (
                            <Typography variant="body2">
                              <strong>GPA:</strong> {edu.gpa}
                            </Typography>
                          )}
                          {edu.coursework && (
                            <Typography variant="body2">
                              <strong>Coursework:</strong> {edu.coursework}
                            </Typography>
                          )}
                          {edu.awards && (
                            <Typography variant="body2">
                              <strong>Awards:</strong> {edu.awards}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < education.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Programming Languages */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Programming Languages
            </Typography>
            <List>
              {programmingLanguages.map((lang: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={lang.name}
                    secondary={`Proficiency: ${lang.proficiency}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Technologies
            </Typography>
            <List>
              {technologies.map((tech: any, index: number) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={tech.name}
                    secondary={`Proficiency: ${tech.proficiency}`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Projects
            </Typography>
            {projects.map((project: any, index: number) => (
              <Box key={index} mb={2}>
                <Typography variant="h6">{project.name}</Typography>
                <Typography variant="body2">
                  <strong>Links:</strong>{" "}
                  {project.links.join(", ") || "No links provided"}
                </Typography>
                <List>
                  {project.bulletPoints.map((point: string, i: number) => (
                    <ListItem key={i}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Employment */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Employment History
            </Typography>
            {employment.map((job: Job, index: number) => (
              <Box key={index} mb={2}>
                <Typography variant="h6">{job.name}</Typography>
                <Typography variant="body2">
                  <strong>Role:</strong> {job.role}
                </Typography>
                <Typography variant="body2">
                  <strong>Dates:</strong> {job.dates}
                </Typography>
                <Typography variant="body2">
                  <strong>Location:</strong>{" "}
                  {`${job.location.city}, ${job.location.state}`}
                </Typography>
                <List>
                  {job.bulletPoints.map((point: string, i: number) => (
                    <ListItem key={i}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}
