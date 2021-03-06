import ContainerLink from "./container-link";
import * as styles from "./project-card.module.css";
import * as React from "react";

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
  <ContainerLink to={linkPath}>
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
  </ContainerLink>
);

export default LargeProjectCard;
