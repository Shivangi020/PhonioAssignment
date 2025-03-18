import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoWrapper}>
        <h1 className={styles.logo}>Osmo</h1>
        <span className={styles.logoIcon}>⟐</span>
      </div>

      <nav className={styles.navbar}>
        <a href="#home" className={styles.navLink}>
          Home
        </a>
        <a href="#pricing" className={styles.navLink}>
          Pricing
        </a>
        <a href="#updates" className={styles.navLink}>
          Updates
          <span className={styles.updateBadge}>59</span>
        </a>
        <a href="#faq" className={styles.navLink}>
          FAQ
        </a>
      </nav>

      <div className={styles.authNav}>
        <a href="#login" className={styles.logInLink}>
          Log in
        </a>
        <a href="#get-started" className={styles.getStartedBtn}>
          Get Started
        </a>
      </div>
    </header>
  );
};

export default Navbar;
