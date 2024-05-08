import { Box, Container, Typography } from "@mui/material";

const Specialist = async () => {
  const res = await fetch("http://localhost:5001/api/v1/specialities", {
    next: {
      revalidate: 30,
    },
  });
  const specialties = await res.json();
  console.log(specialties);
  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" fontWeight={600} mb={1}>
          Explore treatments across specialties
        </Typography>
        <Typography component="p" color="gray">
          Find experienced doctor across all specialties
        </Typography>
      </Box>
    </Container>
  );
};

export default Specialist;
