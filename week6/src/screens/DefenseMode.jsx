import { useState } from 'react';
import styles from './DefenseMode.module.css';

export default function DefenseMode({ onRun }) {
  const [keywordSensitivity, setKeywordSensitivity] = useState(5);
  const [riskThreshold, setRiskThreshold] = useState(7);
  const [senderTrustEnabled, setSenderTrustEnabled] = useState(true);
  const [toneAnalysisEnabled, setToneAnalysisEnabled] = useState(true);

  const getSensitivityLabel = (value) => {
    if (value <= 3) return 'LOW';
    if (value <= 7) return 'BALANCED';
    return 'HIGH';
  };

  const handleRun = () => {
    onRun({
      keywordSensitivity,
      riskThreshold,
      senderTrustEnabled,
      toneAnalysisEnabled
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>DEFENSE CONFIGURATION</h1>
        <p className={styles.subtitle}>
          Adjust the defender's detection parameters and rerun the simulation.
        </p>

        <div className={styles.controls}>
          <div className={styles.control}>
            <div className={styles.controlHeader}>
              <label className={styles.label}>Keyword Sensitivity</label>
              <span className={styles.valueLabel}>{getSensitivityLabel(keywordSensitivity)}</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={keywordSensitivity}
              onChange={(e) => setKeywordSensitivity(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div className={styles.control}>
            <div className={styles.controlHeader}>
              <label className={styles.label}>Quarantine Threshold</label>
              <span className={styles.valueLabel}>Score &gt; {riskThreshold}</span>
            </div>
            <input
              type="range"
              min="5"
              max="9"
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.sliderLabels}>
              <span>5</span>
              <span>9</span>
            </div>
            <p className={styles.hint}>Quarantine emails scoring above {riskThreshold}</p>
          </div>

          <div className={styles.control}>
            <div className={styles.toggleRow}>
              <label className={styles.label}>Sender Trust Enforcement</label>
              <button
                className={`${styles.toggle} ${senderTrustEnabled ? styles.on : styles.off}`}
                onClick={() => setSenderTrustEnabled(!senderTrustEnabled)}
              >
                <span className={styles.toggleText}>{senderTrustEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          <div className={styles.control}>
            <div className={styles.toggleRow}>
              <label className={styles.label}>Tone Analysis</label>
              <button
                className={`${styles.toggle} ${toneAnalysisEnabled ? styles.on : styles.off}`}
                onClick={() => setToneAnalysisEnabled(!toneAnalysisEnabled)}
              >
                <span className={styles.toggleText}>{toneAnalysisEnabled ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.preview}>
          <h3 className={styles.previewTitle}>CONFIGURATION PREVIEW</h3>
          <p className={styles.previewText}>
            With these settings, the defender will {keywordSensitivity >= 7 ? 'aggressively' : 'moderately'} scan for keywords,
            quarantine emails scoring above {riskThreshold},
            {senderTrustEnabled ? ' verify sender domains,' : ' skip sender verification,'}
            {toneAnalysisEnabled ? ' and analyze message tone.' : ' and skip tone analysis.'}
          </p>
        </div>

        <button className={styles.runBtn} onClick={handleRun}>
          RERUN SIMULATION WITH THESE SETTINGS →
        </button>
      </div>
    </div>
  );
}
