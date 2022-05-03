import * as React from "react";
import { Typography } from "@mui/material";
import { Layout } from "../components/layout";

// markup
const IndexPage = () => {
  return (
    <Layout>
      <main>
        <title>Home Page</title>
        <Typography variant="h1">Home</Typography>
      </main>
    </Layout>
  );
};

export default IndexPage;
