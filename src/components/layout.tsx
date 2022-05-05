import React from "react";
import { PropsWithChildren } from "react";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

import "@fontsource/metropolis/300.css";
import "@fontsource/metropolis/400.css";
import "@fontsource/metropolis/500.css";
import "@fontsource/metropolis/700.css";
import { ColumnFlex, Flex } from "./flex";
import { NavBar } from "./navbar";

const theme = createTheme({
  typography: { fontFamily: "Metropolis" },
  palette: {
    primary: { main: "#888" },
    secondary: { main: "#5bc" },
  },
});

/**
 * Shared component across all pages.
 *
 * Details:
 * - Loads Metropolis font family
 * - Applies custom theme
 * - Adds navbar
 */
export const Layout = ({ children }: PropsWithChildren<{}>) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Flex
      width="100%"
    >
      <NavBar />
      <ColumnFlex overflow="auto" px={1.5} flexGrow={1}>
        <ColumnFlex maxWidth={"8.5in"}>{children}</ColumnFlex>
      </ColumnFlex>
    </Flex>
  </ThemeProvider>
);
