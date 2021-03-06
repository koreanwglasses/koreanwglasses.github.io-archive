import HLine from "../components/hline";
import HSpace from "../components/hspace";
import LargeProjectCard from "../components/large-project-card";
import ProjectsSidebarLayout from "../components/projects-sidebar-layout";
import { linkedInUrl, resumeUrl } from "../constants";
import profile from "../images/profile.jpg";
import * as styles from "./index.module.css";
import { graphql } from "gatsby";
import * as React from "react";
import { FiLinkedin, FiFileText } from "react-icons/fi";

type Data = {
  allJavascriptFrontmatter: {
    nodes: {
      frontmatter: {
        title: string;
        description?: string;
        preview: {
          publicURL: string;
        };
        featured: boolean;
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

  const featured = data.allJavascriptFrontmatter.nodes.filter(
    (node) => node.frontmatter.featured
  );

  return (
    <ProjectsSidebarLayout>
      <div className={styles.aboutContainer}>
        <img src={profile} />
        <div className={styles.aboutText}>
          <h2>About Me</h2>
          <p>
            This past summer I was at Carnegie Mellon trying to guess hand poses
            from how they were placed on a tablet screen. I had just finished my
            undergrad at RPI in computer science and pure mathematics, so making
            that jump to human computer interaction wasn’t easy. But I did it
            because I wanted to solve new problems, pick up new skills, and work
            with something real. And I did. we have a paper submitted to UIST,
            and I became one of few people that really understand the full
            potential of capacitive touch screens. Now I’m at UIUC studying
            social computing, where I can take my skills beyond just pen and
            paper theory and apply it to something real, something human.
          </p>
          <a href={resumeUrl}>
            <FiFileText style={{ position: "relative", top: "2px" }} />{" "}
            Resume/CV
          </a>
          <HSpace /> | <HSpace />{" "}
          <a href={linkedInUrl}>
            <FiLinkedin style={{ position: "relative", top: "2px" }} /> LinkedIn
          </a>
        </div>
      </div>
      <HLine />
      <div className={styles.featuredProjectContainer}>
        <h2>Featured Project</h2>
        <LargeProjectCard
          frontmatter={featured[0].frontmatter}
          linkPath={getPath(featured[0])}
        />
      </div>
    </ProjectsSidebarLayout>
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
          featured
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
