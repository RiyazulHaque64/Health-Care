import { getUserInfo } from "@/app/services/auth.service";
import { TUserRole } from "@/app/types";
import { drawerItems } from "@/app/utils/drawerItems";
import { Box, List, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import logo from "../../../assets/svgs/logo.svg";
import SidebarItems from "./SidebarItems";

const SideBar = () => {
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const { role } = getUserInfo();
    setUserRole(role);
  }, []);

  const drawer = (
    <div>
      <List>
        {drawerItems(userRole as TUserRole).map((item, index) => (
          <SidebarItems key={index} item={item} />
        ))}
      </List>
    </div>
  );
  return (
    <Box>
      <Link href="/">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          gap={1}
          pt={2}
          pb={1}
          px={2}
          sx={{ cursor: "pointer" }}
        >
          <Image src={logo} width={40} height={40} alt="logo" />
          <Typography variant="h5" component="h2">
            Health Care
          </Typography>
        </Stack>
      </Link>
      {drawer}
    </Box>
  );
};

export default SideBar;
