import { Check } from 'lucide-react';
import styles from './EmployeeCard.module.css';

export default function EmployeeCard({ employee, selected, onSelect }) {
  const riskColors = {
    'high-value': 'red',
    'medium': 'yellow',
    'low': 'green'
  };

  const riskLabels = {
    'high-value': 'HIGH-VALUE',
    'medium': 'MEDIUM',
    'low': 'LOW'
  };

  const riskColor = riskColors[employee.riskProfile] || 'green';
  const riskLabel = riskLabels[employee.riskProfile] || 'LOW';

  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(employee)}
    >
      {selected && (
        <div className={styles.checkmark}>
          <Check size={16} />
        </div>
      )}
      <div className={styles.header}>
        <h3 className={styles.name}>{employee.name}</h3>
        <span className={styles.role}>{employee.role}</span>
      </div>
      <div className={styles.department}>{employee.department}</div>
      <div className={styles.recent}>
        <span className={styles.recentLabel}>Recent:</span> {employee.recentActivity}
      </div>
      <div className={`${styles.riskBadge} ${styles[riskColor]}`}>
        {riskLabel}
      </div>
    </div>
  );
}
