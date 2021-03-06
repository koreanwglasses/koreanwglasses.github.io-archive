import * as React from "react";
import * as styles from "./project-card.module.css";

const LargeProjectCard = ({
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
    <h3>{frontmatter.title}</h3>
    <p>
      {frontmatter.description}{" "}
      <b>
        <a>Read more...</a>
      </b>
    </p>
  </div>
);

export default LargeProjectCard;
