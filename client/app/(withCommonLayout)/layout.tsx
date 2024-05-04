import { ReactNode } from "react";
import Navbar from "../components/Shared/Navbar/Navbar";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default layout;
