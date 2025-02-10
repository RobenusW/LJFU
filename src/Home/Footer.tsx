import { Box, Container, Typography, Link } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#121212",
        color: "#fff",
        py: 4,
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: "center" }}>
        {/* Brand / Site Name */}
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          LetJobsFindYou.com
        </Typography>

        {/* Email Address */}
        <Typography
          variant="body2"
          sx={{
            color: "gray",
            mb: 2,
            "& a": {
              color: "#fff",
              textDecoration: "none",
              fontWeight: 500,
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          Have questions? Contact us at{" "}
          <Link href="mailto:support@letjobsfindyou.com">
            support@letjobsfindyou.com
          </Link>
        </Typography>

        {/* Copyright */}
        <Typography variant="body2" color="gray">
          © {new Date().getFullYear()} LetJobsFindYou.com. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
