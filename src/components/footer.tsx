import { repoUrl } from "../constants";
import * as styles from "./footer.module.css";
import HLine from "./hline";
import HSpace from "./hspace";
import * as React from "react";
import { FiGithub } from "react-icons/fi";

const Footer = () => (
  <div className={styles.footer}>
    <HLine />
    &copy; 2021 by Frederick Choi <HSpace /> | <HSpace />{" "}
    <a href={repoUrl}>
      <FiGithub style={{ position: "relative", top: "5px" }} /> Source
    </a>
  </div>
);

export default Footer;
