import * as React from "react";
import { Typography } from "@mui/material";
import { Layout } from "../components/layout";
import { ColumnFlex, Flex } from "../components/flex";

// markup
const IndexPage = () => {
  return (
    <Layout>
      <main>
        <title>Home</title>
        {/* Home page header */}
        <ColumnFlex height="100vh">
          <ColumnFlex mt="25vh">
            <Typography variant="h1">Fred Choi</Typography>
            <Typography variant="subtitle1">
              Graduate Student Researcher
              <br />@ University of Illinois at Urbana-Champaign
            </Typography>
          </ColumnFlex>
        </ColumnFlex>
      </main>
    </Layout>
  );
};

export default IndexPage;
