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

        {/* Navigation Links */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Link
            href="/how-it-works"
            color="inherit"
            underline="hover"
            sx={{
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            How It Works
          </Link>
          <Typography variant="body2" color="gray">
            •
          </Typography>
          <Link
            href="/pricing"
            color="inherit"
            underline="hover"
            sx={{
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            Pricing
          </Link>
          <Typography variant="body2" color="gray">
            •
          </Typography>
          <Link
            href="/faqs"
            color="inherit"
            underline="hover"
            sx={{
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            FAQs
          </Link>
          <Typography variant="body2" color="gray">
            •
          </Typography>
          <Link
            href="/contact"
            color="inherit"
            underline="hover"
            sx={{
              "&:hover": {
                color: "#f0f0f0",
              },
            }}
          >
            Companies
          </Link>
        </Box>

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
            letjobsfindyou@gmail.com
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
