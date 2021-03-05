import * as React from "react";
import Layout from "../components/layout";
import * as styles from "./index.module.css";
import profile from "../images/profile.jpg";
import HLine from "../components/hline";
import HSpace from "../components/hspace";
import { FiLinkedin } from "react-icons/fi";
import { GrDocumentText } from "react-icons/gr";
import { linkedInUrl, resumeUrl } from "../constants";
import { graphql, useStaticQuery } from "gatsby";

const HomePage = () => {
  const projectFrontmatters = useStaticQuery(graphql`
    {
      allJavascriptFrontmatter {
        nodes {
          frontmatter {
            title
            preview {
              publicURL
            }
          }
          node {
            relativePath
          }
        }
      }
    }
  `) as {
    data: {
      allJavascriptFrontmatter: {
        nodes: {
          frontmatter: {
            title: string;
            preview: {
              publicURL: string;
            };
          };
          node: {
            relativePath: string;
          };
        };
      };
    };
  };

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
                the few people that really understand the full potential of
                capacitive touch screens. Now I’m at UIUC studying social
                computing, where I can take my skills beyond just pen and paper
                theory and apply it to something real, something human.
              </p>
              <GrDocumentText style={{ position: "relative", top: "4px" }} />{" "}
              <a href={resumeUrl}>Resume/CV</a> <HSpace /> | <HSpace />{" "}
              <FiLinkedin style={{ position: "relative", top: "4px" }} />{" "}
              <a href={linkedInUrl}>LinkedIn</a>
            </div>
          </div>
          <h2>Featured Project</h2>
        </div>
        <div className={styles.sideContentContainer}>
          <h3>Ongoing Projects</h3>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
