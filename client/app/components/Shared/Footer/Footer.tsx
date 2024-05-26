import facebookIcon from "@/app/assets/landing_page/facebook.png";
import { Box, Container, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <Box bgcolor="rgb(17, 26, 34)" py={5}>
      <Stack direction="row" justifyContent="center" gap={4}>
        <Typography color="#fff" component={Link} href="/consultation">
          Consultation
        </Typography>
        <Typography color="#fff" component={Link} href="/health-plans">
          Health Plans
        </Typography>
        <Typography color="#fff" component={Link} href="/medicine">
          Medicine
        </Typography>
        <Typography color="#fff" component={Link} href="/diagnostics">
          Diagnostics
        </Typography>
        <Typography color="#fff" component={Link} href="/ngos">
          NGOs
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="center" gap={2} py={4}>
        <Image src={facebookIcon} alt="Facebook" width={30} height={30} />
        <Image src={facebookIcon} alt="Facebook" width={30} height={30} />
        <Image src={facebookIcon} alt="Facebook" width={30} height={30} />
        <Image src={facebookIcon} alt="Facebook" width={30} height={30} />
        <Image src={facebookIcon} alt="Facebook" width={30} height={30} />
      </Stack>
      <Box sx={{ border: "1px dashed gray" }}></Box>
      <Container>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          py={4}
        >
          <Typography color="#fff">
            &copy;2024, Healthcare all rights reserved
          </Typography>
          <Typography
            variant="h5"
            component={Link}
            href="/"
            fontWeight={600}
            color="#fff"
          >
            Health{" "}
            <Box component="span" color="primary.main">
              Care
            </Box>
          </Typography>
          <Typography color="#fff">
            Privacy policy & Terms and condition
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
