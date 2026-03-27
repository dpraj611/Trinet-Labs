import { CheckCircle2 } from 'lucide-react';
import styles from './BreachSuccess.module.css';

export default function BreachSuccess({ attempt, onReport }) {
  if (!attempt) return null;

  const { email, result, attemptNumber } = attempt;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <CheckCircle2 size={64} className={styles.icon} />
        </div>

        <h1 className={styles.heading}>BREACH SUCCESSFUL</h1>
        <p className={styles.subheading}>
          Payload delivered. Simulated user interaction recorded.
        </p>

        <div className={styles.details}>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Successful attempt:</span>
            <span className={styles.detailValue}>{attemptNumber} of 3</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Template used:</span>
            <span className={styles.detailValue}>{email.templateName}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Final risk score:</span>
            <span className={styles.detailValue}>{result.score} / 10</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Delivery method:</span>
            <span className={styles.detailValue}>
              {email.attackType === 'link' ? 'Link Phishing' : 'Attachment'}
            </span>
          </div>
        </div>

        <button className={styles.reportBtn} onClick={onReport}>
          VIEW FULL REPORT →
        </button>
      </div>
    </div>
  );
}
