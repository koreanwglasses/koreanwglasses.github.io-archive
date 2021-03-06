import * as React from "react";
import Layout from "../components/layout";
import { graphql, StaticQuery } from "gatsby";
import ProjectCard from "../components/project-card";
import HLine from "../components/hline";
import * as styles from "./projects-sidebar-layout.module.css";

type Data = {
  allJavascriptFrontmatter: {
    nodes: {
      frontmatter: {
        title: string;
        description?: string;
        preview: {
          publicURL: string;
        };
      };
      fileAbsolutePath: string;
    }[];
  };
  allSitePage: {
    nodes: {
      path: string;
      componentPath: string;
    }[];
  };
};

const ProjectsSidebarLayout_ = ({
  data,
  children,
}: React.PropsWithChildren<{ data: Data }>) => {
  const getPath = (node: typeof data.allJavascriptFrontmatter.nodes[0]) =>
    data.allSitePage.nodes.find(
      ({ componentPath }) => componentPath === node.fileAbsolutePath
    )?.path;

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.mainContentContainer}>{children}</div>
        <div className={styles.sideContentContainer}>
          <h3>More Projects</h3>
          {data.allJavascriptFrontmatter.nodes.map((node, i) => (
            <>
              <ProjectCard
                frontmatter={node.frontmatter}
                linkPath={getPath(node)}
                key={`card-${i}`}
              />
              <HLine key={`hline-${i}`} />
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
};

const ProjectsSidebarLayout = (
  props: Omit<Parameters<typeof ProjectsSidebarLayout_>[0], "data">
) => (
  <StaticQuery
    query={graphql`
      {
        allJavascriptFrontmatter {
          nodes {
            frontmatter {
              description
              title
              preview {
                publicURL
              }
            }
            fileAbsolutePath
          }
        }
        allSitePage {
          nodes {
            path
            componentPath
          }
        }
      }
    `}
    render={(data) => <ProjectsSidebarLayout_ {...props} data={data} />}
  />
);

export default ProjectsSidebarLayout;
