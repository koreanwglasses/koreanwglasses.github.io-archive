import * as React from "react";
import * as styles from "./header.module.css";
import HLine from "./hline";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>Fred Choi</h1>
      <HLine />
    </div>
  );
};

export default Header;
