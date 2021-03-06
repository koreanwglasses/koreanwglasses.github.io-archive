import * as React from "react";
import MaybeLink from "./maybe-link";
import * as styles from "./project-card.module.css";

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
  <MaybeLink to={linkPath}>
    <div className={styles.container}>
      <img src={frontmatter.preview.publicURL} />
      <p>
        <b>{frontmatter.title}</b> &#8212; {frontmatter.description}{" "}
        <b>
          <a>Read more...</a>
        </b>
      </p>
    </div>
  </MaybeLink>
);

export default ProjectCard;
