import styles from './EmailPreview.module.css';

function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;

  let highlighted = text;
  keywords.forEach(kw => {
    const regex = new RegExp(`(${kw})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });

  return highlighted;
}

export default function EmailPreview({ email, result }) {
  const allKeywords = result.reasons
    .filter(r => r.type.startsWith('keyword'))
    .map(r => {
      const match = r.detail.match(/"([^"]+)"/);
      return match ? match[1] : null;
    })
    .filter(Boolean);

  const bodyWithHighlights = highlightKeywords(email.body, allKeywords);

  const decisionColors = {
    green: styles.green,
    yellow: styles.yellow,
    red: styles.red
  };

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <div className={styles.row}>
          <span className={styles.label}>FROM:</span>
          <span className={styles.value}>{email.from}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>TO:</span>
          <span className={styles.value}>{email.to}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>SUBJECT:</span>
          <span className={styles.value}>{email.subject}</span>
        </div>
      </div>
      <div className={styles.body}>
        <pre dangerouslySetInnerHTML={{ __html: bodyWithHighlights }} />
      </div>
      <div className={styles.footer}>
        <div className={styles.attackBadge}>
          {email.attackType === 'link' ? 'LINK PHISHING' : 'ATTACHMENT'}
        </div>
        <div className={`${styles.resultBadge} ${decisionColors[result.decisionColor]}`}>
          {result.decisionLabel}
        </div>
      </div>
    </div>
  );
}
