import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SimController } from './SimController';
import Navbar from './components/Navbar';
import LabGuide from './components/LabGuide';
import Landing from './screens/Landing';
import TargetSelect from './screens/TargetSelect';
import AttackConfig from './screens/AttackConfig';
import Simulation from './screens/Simulation';
import AdaptationLog from './screens/AdaptationLog';
import BreachSuccess from './screens/BreachSuccess';
import Dashboard from './screens/Dashboard';
import DefenseMode from './screens/DefenseMode';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [guideOpen, setGuideOpen] = useState(false);
  const [pendingAttempt, setPendingAttempt] = useState(null);

  const navigate = (s) => setScreen(s);

  const handleTargetSelect = (target) => {
    SimController.setTarget(target);
    navigate('config');
  };

  const handleConfigSubmit = (config) => {
    SimController.setConfig(config);
    navigate('simulation');
  };

  const handleAttemptComplete = (attempt) => {
    setPendingAttempt(attempt);
    if (attempt.result.decision === 'ALLOW') {
      navigate('breach');
    } else if (SimController.state.finished) {
      navigate('dashboard');
    } else {
      navigate('adaptation');
    }
  };

  const handleAdaptationComplete = () => {
    navigate('simulation');
  };

  const handleReset = () => {
    SimController.reset();
    setPendingAttempt(null);
    navigate('landing');
  };

  const handleDefenseMode = (settings) => {
    SimController.reset();
    SimController.setDefenseSettings(settings);
    navigate('target');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className={styles.app}>
      <Navbar screen={screen} onGuideToggle={() => setGuideOpen(o => !o)} />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className={styles.screenWrapper}
        >
          {screen === 'landing' && <Landing onStart={() => navigate('target')} />}
          {screen === 'target' && <TargetSelect employees={SimController.getEmployees()} onSelect={handleTargetSelect} />}
          {screen === 'config' && <AttackConfig target={SimController.state.target} onSubmit={handleConfigSubmit} />}
          {screen === 'simulation' && <Simulation controller={SimController} onAttemptComplete={handleAttemptComplete} />}
          {screen === 'adaptation' && <AdaptationLog attempt={pendingAttempt} onContinue={handleAdaptationComplete} />}
          {screen === 'breach' && <BreachSuccess attempt={pendingAttempt} onReport={() => navigate('dashboard')} />}
          {screen === 'dashboard' && <Dashboard report={SimController.getFinalReport()} onReset={handleReset} onDefenseMode={() => navigate('defense')} />}
          {screen === 'defense' && <DefenseMode onRun={handleDefenseMode} />}
        </motion.div>
      </AnimatePresence>
      <LabGuide open={guideOpen} screen={screen} onClose={() => setGuideOpen(false)} />
    </div>
  );
}
