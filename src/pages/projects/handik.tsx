import ProjectsSidebarLayout from "../../components/projects-sidebar-layout";
import * as React from "react";

export const frontmatter = {
  title: "HandIK",
  description:
    "We describe how conventional capacitive touchscreens can be used to estimate 3D hand pose, enabling rich interaction opportunities.",
  preview: "../../images/handik-preview.gif",
};

const HandIK = () => (
  <ProjectsSidebarLayout>
    <h1>HandIK</h1>
    <p>A hand-pose estimator from 2D capacitive touchscreen input</p>
  </ProjectsSidebarLayout>
);

export default HandIK;
