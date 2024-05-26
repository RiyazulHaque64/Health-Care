import { ReactNode } from "react";
import DashboardDrawer from "../components/dashboard/dashboardDrawer/dashboardDrawer";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <DashboardDrawer>{children}</DashboardDrawer>;
};

export default DashboardLayout;
