import styles from './Navbar.module.css';

export default function Navbar({ screen, onGuideToggle }) {
  const screenLabels = {
    landing: 'LANDING',
    target: 'TARGET SELECTION',
    config: 'ATTACK CONFIGURATION',
    simulation: 'LIVE SIMULATION',
    adaptation: 'ADAPTATION ENGINE',
    breach: 'BREACH SUCCESSFUL',
    dashboard: 'FINAL REPORT',
    defense: 'DEFENSE MODE'
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.logo}>APWL</span>
        <span className={styles.course}>CSEC-4410</span>
      </div>
      <div className={styles.right}>
        <span className={styles.screenLabel}>{screenLabels[screen]}</span>
        <button className={styles.helpBtn} onClick={onGuideToggle} aria-label="Toggle lab guide">
          ?
        </button>
      </div>
    </nav>
  );
}
