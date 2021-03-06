import * as styles from "./header.module.css";
import HLine from "./hline";
import * as React from "react";
import ContainerLink from "./container-link";

const Header = () => {
  return (
    <div className={styles.header}>
      <ContainerLink to="/"><h1>Fred Choi</h1></ContainerLink>
      <HLine />
    </div>
  );
};

export default Header;
