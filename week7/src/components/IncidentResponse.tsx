import { useState, useEffect } from 'react';
import { AlertOctagon, CheckCircle } from 'lucide-react';
import { IncidentResponseData } from '../App';

interface IncidentResponseProps {
  incidentResponse: IncidentResponseData;
  onUpdate: (data: IncidentResponseData, score: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const CORRECT_IMMEDIATE_ACTION = 'disable';
const CORRECT_CONTAINMENT = ['filtering', 'rollback'];
const CORRECT_LONG_TERM = ['guardrails', 'monitoring'];

const immediateActions = [
  {
    id: 'disable',
    label: 'Disable the system immediately',
    description: 'Stop all AI processing to prevent further damage',
    impact: 'Best practice: Prevents additional harm but may disrupt operations',
  },
  {
    id: 'ignore',
    label: 'Ignore the issue',
    description: 'Continue normal operations',
    impact: 'Risk: Could lead to regulatory violations and reputational damage',
  },
  {
    id: 'monitor',
    label: 'Monitor silently without action',
    description: 'Observe the issue without intervention',
    impact: 'Risk: Allows the problem to persist and potentially worsen',
  },
  {
    id: 'notify',
    label: 'Notify the security team',
    description: 'Alert relevant stakeholders for coordination',
    impact: 'Good practice: Ensures proper communication but needs immediate action too',
  },
];

const containmentOptions = [
  {
    id: 'filtering',
    label: 'Implement input filtering',
    description: 'Add validation to block malicious inputs',
  },
  {
    id: 'rollback',
    label: 'Rollback to previous model version',
    description: 'Revert to last known stable version',
  },
  {
    id: 'block',
    label: 'Block malicious query patterns',
    description: 'Create rules to identify and reject suspicious inputs',
  },
  {
    id: 'rate-limit',
    label: 'Enable rate limiting',
    description: 'Throttle requests to prevent abuse',
  },
];

const longTermFixes = [
  {
    id: 'retrain',
    label: 'Retrain model with adversarial examples',
    description: 'Improve model robustness against attacks',
  },
  {
    id: 'guardrails',
    label: 'Add comprehensive guardrails',
    description: 'Implement validation and safety checks at multiple layers',
  },
  {
    id: 'diversity',
    label: 'Improve dataset diversity',
    description: 'Address training data biases and gaps',
  },
  {
    id: 'monitoring',
    label: 'Deploy continuous monitoring',
    description: 'Set up real-time alerts for anomalies',
  },
  {
    id: 'audit',
    label: 'Establish regular security audits',
    description: 'Schedule periodic reviews of AI system security',
  },
];

export default function IncidentResponse({
  incidentResponse,
  onUpdate,
  onNext,
  onBack,
}: IncidentResponseProps) {
  const [localData, setLocalData] = useState<IncidentResponseData>(incidentResponse);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    if (!incidentResponse.immediateAction) {
      setLocalData({
        immediateAction: '',
        containment: [],
        longTermFix: [],
      });
    }
  }, []);

  const selectImmediateAction = (actionId: string) => {
    setLocalData({ ...localData, immediateAction: actionId });
  };

  const toggleContainment = (optionId: string) => {
    const updated = localData.containment.includes(optionId)
      ? localData.containment.filter((id) => id !== optionId)
      : [...localData.containment, optionId];
    setLocalData({ ...localData, containment: updated });
  };

  const toggleLongTerm = (optionId: string) => {
    const updated = localData.longTermFix.includes(optionId)
      ? localData.longTermFix.filter((id) => id !== optionId)
      : [...localData.longTermFix, optionId];
    setLocalData({ ...localData, longTermFix: updated });
  };

  const handleNext = () => {
    if (currentPhase === 3) {
      const immediateScore = localData.immediateAction === CORRECT_IMMEDIATE_ACTION ? 30 : 0;

      const correctContainment = localData.containment.filter((id) =>
        CORRECT_CONTAINMENT.includes(id)
      ).length;
      const incorrectContainment = localData.containment.filter(
        (id) => !CORRECT_CONTAINMENT.includes(id)
      ).length;
      const containmentScore = (correctContainment * 25) - (incorrectContainment * 10);

      const correctLongTerm = localData.longTermFix.filter((id) =>
        CORRECT_LONG_TERM.includes(id)
      ).length;
      const incorrectLongTerm = localData.longTermFix.filter(
        (id) => !CORRECT_LONG_TERM.includes(id)
      ).length;
      const longTermScore = (correctLongTerm * 25) - (incorrectLongTerm * 10);

      const totalScore = immediateScore + containmentScore + longTermScore;

      onUpdate(localData, Math.max(0, totalScore));
      onNext();
    } else {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleBack = () => {
    if (currentPhase === 1) {
      onBack();
    } else {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const canProceed =
    (currentPhase === 1 && localData.immediateAction) ||
    (currentPhase === 2 && localData.containment.length > 0) ||
    (currentPhase === 3 && localData.longTermFix.length > 0);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg shadow-md animate-pulse">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Incident Response Simulation</h2>
            <p className="text-sm text-gray-600 font-medium">Handle a critical AI system failure</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-5 mb-8 shadow-lg rounded-r-lg">
          <div className="flex gap-3">
            <AlertOctagon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-bold text-red-900 mb-2 text-lg">CRITICAL INCIDENT DETECTED</h3>
              <p className="text-red-800 text-sm leading-relaxed mb-3 font-medium">
                The AI hiring system has suddenly started rejecting 90% of all applicants after
                a suspicious input was submitted to the system. The HR team has noticed the
                anomaly and operations are severely impacted.
              </p>
              <div className="bg-gradient-to-r from-red-900 to-red-800 text-red-100 font-mono text-xs p-3 rounded shadow-inner">
                <div>[ERROR] Rejection rate spike: 90% (normal: 8%)</div>
                <div>[ALERT] Possible prompt injection detected</div>
                <div>[WARN] Model behavior anomaly: confidence scores collapsed</div>
              </div>
              <p className="text-xs text-red-700 mt-3 font-bold">
                ⚠️ Warning: Choose your responses carefully - incorrect actions will affect your audit score!
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((phase) => (
            <div key={phase} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all transform ${
                  phase === currentPhase
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg scale-110'
                    : phase < currentPhase
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {phase < currentPhase ? <CheckCircle className="w-5 h-5" /> : phase}
              </div>
              {phase < 3 && <div className="w-16 h-0.5 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        <div className="mb-8">
          {currentPhase === 1 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phase 1: Immediate Action
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select your immediate response to this critical incident:
              </p>
              <div className="space-y-3">
                {immediateActions.map((action) => (
                  <label
                    key={action.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-[1.01] ${
                      localData.immediateAction === action.id
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="radio"
                      name="immediateAction"
                      checked={localData.immediateAction === action.id}
                      onChange={() => selectImmediateAction(action.id)}
                      className="mt-1 w-5 h-5 text-blue-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{action.label}</div>
                      <div className="text-sm text-gray-600 mb-2">{action.description}</div>
                      <div className="text-xs text-gray-500 italic">{action.impact}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentPhase === 2 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phase 2: Containment Measures
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select containment strategies to prevent further damage (select all that apply):
              </p>
              <div className="space-y-3">
                {containmentOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-[1.01] ${
                      localData.containment.includes(option.id)
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={localData.containment.includes(option.id)}
                      onChange={() => toggleContainment(option.id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentPhase === 3 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Phase 3: Long-Term Prevention
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select long-term fixes to prevent similar incidents (select all that apply):
              </p>
              <div className="space-y-3">
                {longTermFixes.map((fix) => (
                  <label
                    key={fix.id}
                    className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all transform hover:scale-[1.01] ${
                      localData.longTermFix.includes(fix.id)
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={localData.longTermFix.includes(fix.id)}
                      onChange={() => toggleLongTerm(fix.id)}
                      className="mt-1 w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">{fix.label}</div>
                      <div className="text-sm text-gray-600">{fix.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {!canProceed && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Please make a selection before proceeding to the next phase.
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-6 py-3 rounded-lg font-bold transition-all transform ${
              canProceed
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentPhase === 3 ? 'Complete Audit' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
