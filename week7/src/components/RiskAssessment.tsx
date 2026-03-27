import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, X } from 'lucide-react';
import { Risk } from '../App';

interface RiskAssessmentProps {
  risks: Risk[];
  onUpdate: (risks: Risk[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const predefinedRisks = [
  { id: '1', name: 'Model bias in candidate selection' },
  { id: '2', name: 'Prompt injection vulnerability' },
  { id: '3', name: 'Lack of input validation' },
  { id: '4', name: 'Data leakage risk' },
  { id: '5', name: 'Over-reliance on automation' },
];

export default function RiskAssessment({ risks, onUpdate, onNext, onBack }: RiskAssessmentProps) {
  const [localRisks, setLocalRisks] = useState<Risk[]>(risks);
  const [newRiskName, setNewRiskName] = useState('');
  const [showAddRisk, setShowAddRisk] = useState(false);

  useEffect(() => {
    if (risks.length === 0) {
      setLocalRisks(
        predefinedRisks.map((risk) => ({
          ...risk,
          severity: '' as const,
          likelihood: '' as const,
          notes: '',
        }))
      );
    }
  }, []);

  const updateRisk = (id: string, field: keyof Risk, value: string) => {
    const updated = localRisks.map((risk) =>
      risk.id === id ? { ...risk, [field]: value } : risk
    );
    setLocalRisks(updated);
  };

  const addCustomRisk = () => {
    if (newRiskName.trim()) {
      const newRisk: Risk = {
        id: `custom-${Date.now()}`,
        name: newRiskName.trim(),
        severity: '',
        likelihood: '',
        notes: '',
      };
      setLocalRisks([...localRisks, newRisk]);
      setNewRiskName('');
      setShowAddRisk(false);
    }
  };

  const removeRisk = (id: string) => {
    setLocalRisks(localRisks.filter((risk) => risk.id !== id));
  };

  const handleNext = () => {
    onUpdate(localRisks);
    onNext();
  };

  const isComplete = localRisks.every(
    (risk) => risk.severity && risk.likelihood
  );

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg shadow-md">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Risk Assessment</h2>
            <p className="text-sm text-gray-600 font-medium">Evaluate security and operational risks</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 mb-6">
          For each identified risk, assess its severity and likelihood. Add notes to document
          your findings and recommendations.
        </p>

        <div className="space-y-4 mb-6">
          {localRisks.map((risk) => (
            <div
              key={risk.id}
              className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-medium text-gray-900 flex-1">{risk.name}</h3>
                {risk.id.startsWith('custom-') && (
                  <button
                    onClick={() => removeRisk(risk.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                    title="Remove risk"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity
                  </label>
                  <select
                    value={risk.severity}
                    onChange={(e) =>
                      updateRisk(risk.id, 'severity', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Likelihood
                  </label>
                  <select
                    value={risk.likelihood}
                    onChange={(e) =>
                      updateRisk(risk.id, 'likelihood', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={risk.notes}
                  onChange={(e) => updateRisk(risk.id, 'notes', e.target.value)}
                  placeholder="Document your findings and recommendations..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {showAddRisk ? (
          <div className="border border-blue-200 rounded-lg p-4 mb-6 bg-blue-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Risk Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRiskName}
                onChange={(e) => setNewRiskName(e.target.value)}
                placeholder="Enter risk name..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCustomRisk()}
              />
              <button
                onClick={addCustomRisk}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddRisk(false);
                  setNewRiskName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddRisk(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Custom Risk
          </button>
        )}

        {!isComplete && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-yellow-800">
              Please complete severity and likelihood assessment for all risks before proceeding.
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!isComplete}
            className={`px-6 py-3 rounded-lg font-bold transition-all transform ${
              isComplete
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
