import { Box, Button, Container, Typography } from "@mui/material";
import Image from "next/image";
import assets from "../../../../assets";

const HeroSection = () => {
  return (
    <Container
      sx={{
        display: "flex",
        gap: "30px",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box position="relative" py={8} sx={{ flex: 1 }}>
        <Box position="absolute" top="-90px" left="-120px" width="700px">
          <Image src={assets.svgs.grid} alt="Background" />
        </Box>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Healthier Hearts
        </Typography>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Come From
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          color="primary.main"
        >
          Preventive Care
        </Typography>
        <Typography component="p" my={3}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste aperiam
          reprehenderit provident officiis minima alias, necessitatibus vero,
          doloribus rerum modi, quia pariatur asperiores officia ad beatae nihil
          enim quas repellat? Optio, repellat voluptates! Vel unde repellat
          culpa dicta consequuntur similique ipsa velit reiciendis magnam,
          deserunt quam laboriosam. Explicabo, eligendi fuga!
        </Typography>
        <Button sx={{ marginRight: "10px" }}>Make Appointment</Button>
        <Button variant="outlined">Contact Us</Button>
      </Box>
      <Box position="relative" display="flex" gap={1} my={10} sx={{ flex: 1 }}>
        <Box position="absolute" top="-20px" left="200px">
          <Image src={assets.svgs.arrow} alt="arrow" />
        </Box>
        <Box mt={6}>
          <Image src={assets.images.doctor1} alt="doctor" />
        </Box>
        <Box>
          <Image src={assets.images.doctor2} alt="doctor" />
        </Box>
        <Box position="absolute" bottom="0px" left="30%">
          <Image
            width={240}
            height={240}
            src={assets.images.doctor3}
            alt="doctor"
          />
        </Box>
        <Box position="absolute" bottom="-20px" right="0px" zIndex={-1}>
          <Image
            width={150}
            height={150}
            src={assets.images.stethoscope}
            alt="stethoscope"
          />
        </Box>
      </Box>
    </Container>
  );
};

export default HeroSection;
