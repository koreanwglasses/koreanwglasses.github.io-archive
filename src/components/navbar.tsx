import { Typography } from "@mui/material";
import React from "react";
import { ColumnFlex } from "./flex";
import { Link } from "./link";

const pages = [
  { href: "/", name: "Home" },
  { href: "/cv", name: "CV / Resume" },
];

export const NavBar = () => (
  <ColumnFlex
    component="nav"
    width={300}
    borderRight={1}
    px={1.5}
    alignItems="end"
    justifyContent="center"
    flexShrink={0}
  >
    {pages.map(({ href, name }, i) => (
      <Link
        href={href}
        key={i}
        underline="hover"
        color={window.location.pathname == href ? "secondary" : "primary"}
        sx={{ textTransform: "uppercase", fontSize: 18 }}
      >
        {name}
        <span style={{ userSelect: "none" }}>{" 〈"}</span>
      </Link>
    ))}
  </ColumnFlex>
);
