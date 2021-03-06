import * as React from "react";
import Layout from "../../components/layout";

export const frontmatter = {
  title: "HandIK",
  description:
    "We describe how conventional capacitive touchscreens can be used to estimate 3D hand pose, enabling rich interaction opportunities.",
  preview: "../../images/handik-preview.gif",
};

const HandIK = () => (
  <Layout>
    <h1>HandIK</h1>
    <p>A hand-pose estimator from 2D capacitive touchscreen input</p>
  </Layout>
);

export default HandIK;
