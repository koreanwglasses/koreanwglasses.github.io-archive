import * as React from "react";
import MaybeLink from "./maybe-link";
import * as styles from "./project-card.module.css";

const LargeProjectCard = ({
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
      <h3>{frontmatter.title}</h3>
      <p>
        {frontmatter.description}{" "}
        <b>
          <a>Read more...</a>
        </b>
      </p>
    </div>
  </MaybeLink>
);

export default LargeProjectCard;
