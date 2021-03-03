import * as React from "react";
import * as styles from "./footer.module.css";
import HLine from "./hline";
import { FiGithub } from "react-icons/fi";
import HSpace from "./hspace";

const repoUrl =
  "https://github.com/koreanwglasses/koreanwglasses.github.io/tree/new-site";
const Footer = () => (
  <div className={styles.footer}>
    <HLine />
    &copy; 2021 by Frederick Choi <HSpace /> | <HSpace />{" "}
    <FiGithub style={{ position: "relative", top: "5px" }} />{" "}
    <a href={repoUrl}>Source</a>
  </div>
);

export default Footer;
