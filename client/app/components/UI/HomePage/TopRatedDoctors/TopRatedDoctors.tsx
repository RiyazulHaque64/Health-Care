import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import Image from "next/image";

const TopRatedDoctors = async () => {
  const res = await fetch("http://localhost:5001/api/v1/doctor?page=1&limit=3");
  const { data: doctors } = await res.json();
  console.log(doctors);
  return (
    <Box
      sx={{
        my: 10,
        py: 20,
        backgroundColor: "rgba(20, 20, 20, 0.1)",
        clipPath: "polygon(0 0, 100% 25%, 100% 100%, 0 75%)",
      }}
    >
      <Box textAlign="center">
        <Typography variant="h4" component="h1" fontWeight={600} mb={1}>
          Our Top Rated Doctors
        </Typography>
        <Typography component="p" color="gray">
          Access to expert physician and sergeons, Find experienced doctor
          across all specialties
        </Typography>
      </Box>
      <Container sx={{ margin: "30px auto" }}>
        <Grid container spacing={2}>
          {doctors?.map((doctor: any) => (
            <Grid item md={4} key={doctor.id}>
              <Card>
                <Box>
                  <Image
                    src={doctor.profilePhoto}
                    alt="doctor"
                    width={400}
                    height={200}
                  />
                </Box>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    fontWeight={600}
                  >
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doctor.qualification}, {doctor.designation}
                  </Typography>
                  <Typography component="p" color="text.secondary">
                    <LocationOnIcon /> {doctor.address}
                  </Typography>
                </CardContent>
                <CardActions
                  sx={{ justifyContent: "space-around", marginBottom: "20px" }}
                >
                  <Button variant="contained">Book Now</Button>
                  <Button variant="outlined">View Profile</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TopRatedDoctors;
