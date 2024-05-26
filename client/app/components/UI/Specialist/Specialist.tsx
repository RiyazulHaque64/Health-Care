import { Box, Button, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";

const Specialist = async () => {
  const res = await fetch("http://localhost:5001/api/v1/specialities", {
    next: {
      revalidate: 30,
    },
  });
  const {
    data: { data: specialties },
  } = await res.json();

  return (
    <Container>
      <Box textAlign="center">
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600} mb={1}>
            Explore treatments across specialties
          </Typography>
          <Typography component="p" color="gray">
            Find experienced doctor across all specialties
          </Typography>
        </Box>
        <Stack direction="row" gap={5} mt={5} mb={5}>
          {specialties?.slice(0, 6)?.map((item: any) => (
            <Box
              sx={{
                flex: 1,
                width: "150px",
                border: "1px solid rgba(250, 250, 250, 1)",
                borderRadius: "10px",
                padding: "40px 10px",
                backgroundColor: "rgba(245, 245, 245, 1)",
                "& img": {
                  width: "50px",
                  height: "50px",
                  margin: "0 auto",
                },
                "&:hover": {
                  border: "1px solid blue",
                },
              }}
              key={item.id}
            >
              <Image
                width={100}
                height={100}
                src={item.icon}
                alt="specialties icon"
              />
              <Typography
                component="p"
                textAlign="center"
                fontWeight={600}
                mt={2}
              >
                {item.title}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Button>View All</Button>
      </Box>
    </Container>
  );
};

export default Specialist;
