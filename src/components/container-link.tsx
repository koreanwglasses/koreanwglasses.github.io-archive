import * as styles from "./container-link.module.css";
import { Link } from "gatsby";
import * as React from "react";

const ContainerLink = ({
  to,
  children,
}: React.PropsWithChildren<{ to?: string }>) =>
  to ? (
    <Link to={to} style={{ color: "inherit", textDecoration: "inherit" }}>
      <div className={styles.container}>{children}</div>
    </Link>
  ) : (
    <>{children}</>
  );

export default ContainerLink;
