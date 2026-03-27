import { Target, Shield, RotateCw } from 'lucide-react';
import styles from './Landing.module.css';

export default function Landing({ onStart }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.badge}>CSEC-4410 · WEEK 6 · TRINET LAYER</div>
        <h1 className={styles.heading}>AUTONOMOUS PHISHING WARFARE LAB</h1>
        <p className={styles.subheading}>
          Simulate an adaptive phishing agent. Observe how attacks evolve to bypass detection.
        </p>

        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠</span>
          <span>Simulated environment — no real emails sent, no real systems affected</span>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Target size={20} />
            <span>Adaptive Attacker</span>
          </div>
          <div className={styles.feature}>
            <Shield size={20} />
            <span>Rule-Based Defender</span>
          </div>
          <div className={styles.feature}>
            <RotateCw size={20} />
            <span>Self-Correcting Loop</span>
          </div>
        </div>

        <button className={styles.ctaButton} onClick={onStart}>
          INITIALIZE SIMULATION →
        </button>
      </div>
    </div>
  );
}
