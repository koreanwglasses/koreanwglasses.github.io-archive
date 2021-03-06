import ContainerLink from "./container-link";
import * as styles from "./project-card.module.css";
import * as React from "react";

const ProjectCard = ({
  frontmatter,
  linkPath,
}: {
  frontmatter: {
    title: string;
    description?: string;
    preview: {
      publicURL: string;
    };
  };
  linkPath?: string;
}) => (
  <ContainerLink to={linkPath}>
    <div className={styles.container}>
      <img src={frontmatter.preview.publicURL} />
      <p>
        <b>{frontmatter.title}</b> &#8212; {frontmatter.description}{" "}
        <b>
          <a>Read more...</a>
        </b>
      </p>
    </div>
  </ContainerLink>
);

export default ProjectCard;
