import * as React from "react";
import Layout from "../components/layout";
import * as styles from "./index.module.css";
import profile from "../images/profile.jpg";

const HomePage = () => {
  return (
    <Layout>
      <div className={styles.homepageContainer}>
          <div className={styles.aboutContainer}>
            <img src={profile} />
            <div>
              <h2>About Me</h2>
              <p>
                This past summer I was at Carnegie Mellon trying to guess hand
                poses from how they were placed on a tablet screen. I had just
                finished my undergrad at RPI in computer science and pure
                mathematics, so making that jump to human computer interaction
                wasn’t easy. But I did it because I wanted to solve new
                problems, pick up new skills, and work with something real. And
                I did. I became one of the few people that really understand the
                full potential of capacitive touch screens, and we have a paper
                submitted to UIST. Now I’m at UIUC studying social computing,
                where I can take my skills beyond just pen and paper theory and
                apply it to something real, something human.
              </p>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
