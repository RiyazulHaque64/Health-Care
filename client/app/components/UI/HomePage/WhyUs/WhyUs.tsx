import { Box, Container, Typography } from "@mui/material";

const WhyUs = () => {
  return (
    <Container>
      <Box textAlign="center">
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          mb={1}
          color="primary"
        >
          Why Us
        </Typography>
        <Typography variant="h4" component="h3" fontWeight={600}>
          Why Choose Us
        </Typography>
      </Box>
    </Container>
  );
};

export default WhyUs;
