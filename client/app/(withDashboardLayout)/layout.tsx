"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import DashboardDrawer from "../components/dashboard/dashboardDrawer/dashboardDrawer";
import { isLoggedIn } from "../services/auth.service";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  if (!isLoggedIn()) {
    return router.push("/login");
  }
  return <DashboardDrawer>{children}</DashboardDrawer>;
};

export default DashboardLayout;
