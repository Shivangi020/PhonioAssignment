import Image from "next/image";
import Background from "./Background";
import styles from "./component.module.css";
import team1 from "../../assets/team1.jpg";
import team2 from "../../assets/team2.jpg";

const LEFTBUTTONS = [
  "Buttons",
  "Components",
  "Transitions",
  "Loaders",
  "Animations",
];
const RIGHTBUTTONS = ["Documentations", "Tools", "References", "Tutorials"];

const Hero = () => {
  return (
    <main className={styles.heroMain}>
      <Background />
      <section className={styles.grid}>
        <div id="left" className={styles.gridChild1}>
          <div className={styles.btnCn}>
            {LEFTBUTTONS?.map((btn) => {
              return (
                <div key={btn} className={styles.textBtn}>
                  {btn}
                </div>
              );
            })}
          </div>
          <div className={styles.btnCn}>
            {RIGHTBUTTONS?.map((btn) => {
              return (
                <div key={btn} className={styles.textBtn}>
                  {btn}
                </div>
              );
            })}
          </div>
        </div>
        <div id="right" className={styles.gridChild2}>
          <div className={styles.heroTagLine}>
            Start building websites people remember.
          </div>
          <div className={styles.btnContainer}>
            <button className={`${styles.button} ${styles.buttonBgWhite}`}>
              Become a member
            </button>
            <button
              className={`${styles.button} ${styles.buttonBgTransparent}`}
            >
              <span className={styles.teamImgCn}>
                <Image src={team1} alt="team1" className={styles.teamImg} />
              </span>
              <span
                className={styles.teamImgCn}
                style={{ translate: "-4px 0", marginRight: "0.5em" }}
              >
                <Image src={team2} alt="team2" className={styles.teamImg} />
              </span>
              About Us
            </button>
          </div>
          <div className={styles.singleLineWrraper}>
            <div className={styles.singleLine}>
              Osmo came from constantly digging through old projects
            </div>
            <div className={styles.singleLine}>
              wondering,‘How did I build that again?’ It is basically our
            </div>
            <div className={styles.singleLine}>
              personal toolbox, packed with components, techniques,
            </div>
            <div className={styles.singleLine}>
              tricks and tutorials—and it will keep growing.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
