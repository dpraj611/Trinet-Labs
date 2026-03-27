import { useEffect, useRef } from 'react';
import styles from './LogPanel.module.css';

export default function LogPanel({ entries, title, indicatorColor }) {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [entries]);

  const getEntryClass = (type) => {
    if (type === 'warning') return styles.warning;
    if (type === 'danger') return styles.danger;
    if (type === 'success') return styles.success;
    return styles.info;
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={`${styles.indicator} ${styles[indicatorColor]}`} />
        <span className={styles.title}>{title}</span>
      </div>
      <div className={styles.logArea} ref={logRef}>
        {entries.map((entry, idx) => (
          <div key={idx} className={`${styles.entry} ${getEntryClass(entry.type)}`}>
            <span className={styles.time}>[{entry.time}]</span> {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}
