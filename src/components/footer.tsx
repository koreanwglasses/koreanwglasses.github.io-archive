import * as React from "react";
import HLine from "./hline";
import { FiGithub } from "react-icons/fi";
import HSpace from "./hspace";
import { repoUrl } from "../constants";
import * as styles from "./footer.module.css";

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
