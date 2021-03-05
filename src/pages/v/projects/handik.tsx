import * as React from "react";
import Layout from "../../../components/layout";

export const frontmatter = {
  title: "HandIK",
  preview: "../../../images/profile.jpg",
};

const HandIK = () => (
  <Layout>
    <h1>HandIK</h1>
    <p>A hand-pose estimator from 2D capacitive touchscreen input</p>
  </Layout>
);

export default HandIK;
