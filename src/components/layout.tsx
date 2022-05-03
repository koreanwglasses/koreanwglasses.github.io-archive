import React from "react";
import { PropsWithChildren } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import "@fontsource/metropolis/300.css";
import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/700.css";

const theme = createTheme({
  typography: { fontFamily: "Metropolis" },
});

/**
 * Shared component across all pages.
 *
 * Details:
 * - Loads Metropolis font family
 * - Applies custom theme
 */
export const Layout = ({ children }: PropsWithChildren<{}>) => (
  <ThemeProvider theme={theme}>
    <CssBaseline /> {children}
  </ThemeProvider>
);
