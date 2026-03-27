import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import styles from './LabGuide.module.css';

const guideContent = {
  landing: {
    title: "Welcome",
    body: "This lab simulates an autonomous phishing agent that adapts to security controls. You will configure an attack, observe how it's detected, and watch the agent evolve its tactics to bypass defenses. No real emails are sent — this is a safe, educational simulation."
  },
  target: {
    title: "Target Selection",
    body: "Select an employee to attack. High-value targets like executives may have different security profiles. Each employee has unique interests and recent activity that the attacker will use for personalization."
  },
  config: {
    title: "Attack Configuration",
    body: "Configure tone, attack type, and impersonation strategy. These parameters determine the initial phishing email template. The attacker will adapt if the first attempt fails."
  },
  simulation: {
    title: "Live Simulation",
    body: "Watch the attacker craft the email and the defender evaluate it in real time. The attacker personalizes the payload using target intelligence. The defender assigns a risk score based on keywords, sender verification, and tone analysis."
  },
  adaptation: {
    title: "Feedback Engine",
    body: "The attacker analyzes why the last attempt failed and adapts its payload. It removes urgency keywords, changes sender domains, or switches impersonation strategies. This demonstrates how real attackers iterate to evade detection."
  },
  breach: {
    title: "Breach Achieved",
    body: "The phishing email bypassed detection. The user is simulated to have clicked. In a real scenario, this would compromise credentials or install malware. Review the successful payload to understand what made it effective."
  },
  dashboard: {
    title: "Final Report",
    body: "Review all attempts, detection reasons, and the attacker's evolution. Analyze how the agent adapted and which detection rules were most effective. Use this data to improve defensive strategies."
  },
  defense: {
    title: "Defense Mode",
    body: "Adjust the defender's parameters and observe how it changes outcomes. Increase keyword sensitivity to catch more attacks, but risk false positives. Lower the quarantine threshold to be more aggressive. Experiment to find the optimal balance."
  }
};

export default function LabGuide({ open, screen, onClose }) {
  const content = guideContent[screen] || guideContent.landing;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={styles.drawer}
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>{content.title}</h2>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close guide">
                <X size={20} />
              </button>
            </div>
            <div className={styles.body}>
              <p>{content.body}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
