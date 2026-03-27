import employees from './data/employees.json';
import { selectTemplate, buildEmail } from './engine/attacker.js';
import { evaluateEmail } from './engine/defender.js';
import { adaptStrategy } from './engine/feedback.js';

export const SimController = {
  state: {
    target: null,
    config: null,
    defenseSettings: {},
    attempts: [],
    currentAttempt: 0,
    finished: false,
    breached: false
  },

  reset() {
    this.state = {
      target: null,
      config: null,
      defenseSettings: {},
      attempts: [],
      currentAttempt: 0,
      finished: false,
      breached: false
    };
  },

  setTarget(target) {
    this.state.target = target;
  },

  setConfig(config) {
    this.state.config = { ...config };
  },

  setDefenseSettings(settings) {
    this.state.defenseSettings = settings;
  },

  runAttempt(attemptNumber, previousFailureReason = null) {
    const { target, config, defenseSettings } = this.state;
    const template = selectTemplate(config, attemptNumber, previousFailureReason);
    const email = buildEmail(target, config, template);
    const result = evaluateEmail(email, target, defenseSettings);

    let adaptationLogs = [];
    let nextConfig = config;

    if (result.decision !== 'ALLOW' && attemptNumber < 3) {
      const adaptation = adaptStrategy(result, config, attemptNumber);
      adaptationLogs = adaptation.logs;
      nextConfig = adaptation.newConfig;
      this.state.config = nextConfig;
    }

    const attempt = { attemptNumber, email, result, adaptationLogs };
    this.state.attempts.push(attempt);
    this.state.currentAttempt = attemptNumber;

    if (result.decision === 'ALLOW') {
      this.state.breached = true;
      this.state.finished = true;
    } else if (attemptNumber >= 3) {
      this.state.finished = true;
    }

    return attempt;
  },

  getEmployees() {
    return employees;
  },

  getFinalReport() {
    const { attempts, breached } = this.state;
    const totalAttempts = attempts.length;
    const blocked = attempts.filter(a => a.result.decision !== 'ALLOW').length;
    const highestScore = Math.max(...attempts.map(a => a.result.score));
    return { totalAttempts, blocked, breached, highestScore, attempts };
  }
};
