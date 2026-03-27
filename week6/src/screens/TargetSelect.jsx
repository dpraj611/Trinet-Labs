import { useState } from 'react';
import EmployeeCard from '../components/EmployeeCard';
import styles from './TargetSelect.module.css';

export default function TargetSelect({ employees, onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (employee) => {
    setSelected(employee);
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>SELECT TARGET</h1>
        <p className={styles.subtitle}>Trinet Layer — Internal Directory</p>
      </div>

      <div className={styles.grid}>
        {employees.map(emp => (
          <EmployeeCard
            key={emp.id}
            employee={emp}
            selected={selected?.id === emp.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.selectedInfo}>
          {selected ? (
            <>Selected: <strong>{selected.name}</strong></>
          ) : (
            'No target selected'
          )}
        </div>
        <button
          className={styles.confirmBtn}
          disabled={!selected}
          onClick={handleConfirm}
        >
          CONFIRM TARGET →
        </button>
      </div>
    </div>
  );
}
