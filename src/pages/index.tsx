import * as React from "react";
import Layout from "../components/layout";
import * as styles from "./index.module.css";
import profile from "../images/profile.jpg";
import HSpace from "../components/hspace";
import { FiLinkedin, FiFileText } from "react-icons/fi";
import { linkedInUrl, resumeUrl } from "../constants";
import { graphql } from "gatsby";
import ProjectCard from "../components/project-card";
import HLine from "../components/hline";
import LargeProjectCard from "../components/large-project-card";

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

function HomePage({ data }: { data: Data }) {
  const getPath = (node: typeof data.allJavascriptFrontmatter.nodes[0]) =>
    data.allSitePage.nodes.find(
      ({ componentPath }) => componentPath === node.fileAbsolutePath
    )?.path;

  return (
    <Layout>
      <div className={styles.homepageContainer}>
        <div className={styles.mainContentContainer}>
          <div className={styles.aboutContainer}>
            <img src={profile} />
            <div className={styles.aboutText}>
              <h2>About Me</h2>
              <p>
                This past summer I was at Carnegie Mellon trying to guess hand
                poses from how they were placed on a tablet screen. I had just
                finished my undergrad at RPI in computer science and pure
                mathematics, so making that jump to human computer interaction
                wasn’t easy. But I did it because I wanted to solve new
                problems, pick up new skills, and work with something real. And
                I did. we have a paper submitted to UIST, and I became one of
                few people that really understand the full potential of
                capacitive touch screens. Now I’m at UIUC studying social
                computing, where I can take my skills beyond just pen and paper
                theory and apply it to something real, something human.
              </p>
              <a href={resumeUrl}>
                <FiFileText style={{ position: "relative", top: "2px" }} />{" "}
                Resume/CV
              </a>
              <HSpace /> | <HSpace />{" "}
              <a href={linkedInUrl}>
                <FiLinkedin style={{ position: "relative", top: "2px" }} />{" "}
                LinkedIn
              </a>
            </div>
          </div>
          <HLine />
          <div className={styles.featuredProjectContainer}>
            <h2>Featured Project</h2>
            <LargeProjectCard
              frontmatter={data.allJavascriptFrontmatter.nodes[0].frontmatter}
            />
          </div>
        </div>
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
}

export const query = graphql`
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
`;

export default HomePage;
