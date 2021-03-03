import * as React from "react";
import Footer from "./footer";
import Header from "./header";
import "./layout.css";
import * as styles from "./layout.module.css";

const Layout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className={styles.pageContainer}>
    <Header />
    <div className={styles.contentContainer}>{children}</div>
    <Footer />
  </div>
);

export default Layout;
