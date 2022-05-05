import * as React from "react";
import { Box, Typography } from "@mui/material";
import { Layout } from "../components/layout";
import { ColumnFlex } from "../components/flex";
import { Link } from "../components/link";
import { graphql } from "gatsby";

// markup
const CVPage = ({ data }: { data: { custom: { html: string } } }) => {
  return (
    <Layout>
      <main>
        <title>CV / Resume</title>
        <ColumnFlex height="100vh">
          <ColumnFlex mt="25vh">
            <Typography variant="h1">CV/Resume</Typography>
            <Typography variant="subtitle1">
              Download as a pdf{" "}
              <Link
                href="https://docs.google.com/document/d/1n-r0qla4d5aVM4oY-JcQNjbxmcguMa-11W72-pcK6n8/export?format=pdf"
                target="_blank"
              >
                here.
              </Link>
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: data.custom.html }}
              sx={{
                "& a": { color: (theme) => theme.palette.primary.main },
                "& table": {
                  width: "100%",
                  marginBottom: 1,
                  "& p": {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                },
                "& td": {
                  verticalAlign: "top",
                },
              }}
            />
          </ColumnFlex>
        </ColumnFlex>
      </main>
    </Layout>
  );
};

export const query = graphql`
  query {
    custom(name: { eq: "cv-source" }) {
      html
    }
  }
`;

export default CVPage;
