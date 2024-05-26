"use client";

import store from "@/app/redux/store";
import { ThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { theme } from "../theme/theme";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  );
};

export default Providers;
