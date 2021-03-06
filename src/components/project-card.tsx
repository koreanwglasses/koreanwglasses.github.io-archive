import * as React from "react";
import * as styles from "./project-card.module.css";

const ProjectCard = ({
  frontmatter,
}: {
  frontmatter: {
    title: string;
    description?: string;
    preview: {
      publicURL: string;
    };
  };
}) => (
  <div className={styles.container}>
    <img src={frontmatter.preview.publicURL} />
    <p>
      <b>{frontmatter.title}</b> &#8212; {frontmatter.description}{" "}
      <b>
        <a>Read more...</a>
      </b>
    </p>
  </div>
);

export default ProjectCard;
