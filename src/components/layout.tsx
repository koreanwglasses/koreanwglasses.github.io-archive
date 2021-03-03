import * as React from "react";
import Header from "./header";
import "./layout.css";
import * as styles from "./layout.module.css";

const Layout = ({ children }: React.PropsWithChildren<{}>) => (
  <div className={styles.contentContainer}>
    <Header />
    {children}
  </div>
);

export default Layout;
