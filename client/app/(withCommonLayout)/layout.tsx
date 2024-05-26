import { Box } from "@mui/material";
import { ReactNode } from "react";
import Footer from "../components/Shared/Footer/Footer";
import Navbar from "../components/Shared/Navbar/Navbar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <Box sx={{ minHeight: "100vh" }}>{children}</Box>
      <Footer />
    </div>
  );
};

export default layout;
