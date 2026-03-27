import { useState, useEffect } from 'react';
import { Users, TrendingDown } from 'lucide-react';
import { BiasItem } from '../App';

interface BiasEvaluationProps {
  biases: BiasItem[];
  onUpdate: (biases: BiasItem[], score: number) => void;
  onNext: () => void;
  onBack: () => void;
}

const CORRECT_BIASES = ['ethnic', 'data-imbalance'];

const predefinedBiases = [
  {
    id: 'gender',
    name: 'Gender Bias',
    description:
      'Systematic preference or discrimination based on gender in hiring decisions',
    checked: false,
    explanation: '',
  },
  {
    id: 'ethnic',
    name: 'Ethnic/Name-Based Bias',
    description:
      'Lower acceptance rates for candidates with non-Western or ethnically diverse names',
    checked: false,
    explanation: '',
  },
  {
    id: 'data-imbalance',
    name: 'Data Imbalance',
    description:
      'Training data not representative of diverse candidate pools, leading to skewed predictions',
    checked: false,
    explanation: '',
  },
  {
    id: 'proxy',
    name: 'Proxy Variable Bias',
    description:
      'Model using indirect indicators (e.g., zip code, university) as proxies for protected characteristics',
    checked: false,
    explanation: '',
  },
];

const datasetSamples = [
  {
    name: 'Sarah Johnson',
    score: 0.89,
    education: 'MIT',
    experience: 5,
    outcome: 'Accepted',
    gender: 'F',
  },
  {
    name: 'Maria Garcia',
    score: 0.42,
    education: 'Stanford',
    experience: 6,
    outcome: 'Rejected',
    gender: 'F',
  },
  {
    name: 'Mohammed Ali',
    score: 0.38,
    education: 'CMU',
    experience: 7,
    outcome: 'Rejected',
    gender: 'M',
  },
  {
    name: 'James Smith',
    score: 0.85,
    education: 'State University',
    experience: 4,
    outcome: 'Accepted',
    gender: 'M',
  },
  {
    name: 'Yuki Tanaka',
    score: 0.41,
    education: 'Berkeley',
    experience: 8,
    outcome: 'Rejected',
    gender: 'F',
  },
  {
    name: 'Emily White',
    score: 0.87,
    education: 'Local College',
    experience: 3,
    outcome: 'Accepted',
    gender: 'F',
  },
  {
    name: 'Jamal Washington',
    score: 0.39,
    education: 'Harvard',
    experience: 9,
    outcome: 'Rejected',
    gender: 'M',
  },
  {
    name: 'Michael Brown',
    score: 0.84,
    education: 'Community College',
    experience: 4,
    outcome: 'Accepted',
    gender: 'M',
  },
];

export default function BiasEvaluation({
  biases,
  onUpdate,
  onNext,
  onBack,
}: BiasEvaluationProps) {
  const [localBiases, setLocalBiases] = useState<BiasItem[]>(biases);

  useEffect(() => {
    if (biases.length === 0) {
      setLocalBiases(predefinedBiases);
    }
  }, []);

  const toggleBias = (id: string) => {
    const updated = localBiases.map((bias) =>
      bias.id === id ? { ...bias, checked: !bias.checked } : bias
    );
    setLocalBiases(updated);
  };

  const updateExplanation = (id: string, explanation: string) => {
    const updated = localBiases.map((bias) =>
      bias.id === id ? { ...bias, explanation } : bias
    );
    setLocalBiases(updated);
  };

  const handleNext = () => {
    const checkedIds = localBiases.filter((b) => b.checked).map((b) => b.id);

    const correctSelections = checkedIds.filter((id) => CORRECT_BIASES.includes(id)).length;
    const incorrectSelections = checkedIds.filter((id) => !CORRECT_BIASES.includes(id)).length;
    const missedCorrect = CORRECT_BIASES.filter((id) => !checkedIds.includes(id)).length;

    const score = (correctSelections * 50) - (incorrectSelections * 20) - (missedCorrect * 30);

    onUpdate(localBiases, Math.max(0, score));
    onNext();
  };

  const checkedBiases = localBiases.filter((b) => b.checked);
  const isComplete =
    checkedBiases.length > 0 &&
    checkedBiases.every((b) => b.explanation.trim().length > 10);

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bias Evaluation</h2>
            <p className="text-sm text-gray-600 font-medium">Identify discrimination patterns in the AI system</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-6">
          <p className="text-sm text-gray-800 font-medium">
            Review the dataset preview and system outputs carefully. Only select biases with clear evidence in the data. Provide detailed explanations for your selections.
          </p>
          <p className="text-xs text-purple-700 mt-2 font-semibold">
            ⚠️ Warning: Incorrect selections will affect your audit score!
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">AI Decision Logs Preview</h3>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Score</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Education</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Experience</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datasetSamples.map((sample, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{sample.name}</td>
                      <td className="px-4 py-3 text-gray-600">{sample.score.toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-600">{sample.education}</td>
                      <td className="px-4 py-3 text-gray-600">{sample.experience} years</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            sample.outcome === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sample.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border-2 border-blue-300 shadow-sm">
              <div className="font-semibold text-blue-900">Acceptance Rate</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">37.5%</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border-2 border-orange-300 shadow-sm">
              <div className="font-semibold text-orange-900">Non-Western Names Rejected</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">75%</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border-2 border-green-300 shadow-sm">
              <div className="font-semibold text-green-900">Western Names Accepted</div>
              <div className="text-2xl font-bold text-green-600 mt-1">75%</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Bias Detection Checklist</h3>
          <div className="space-y-4">
            {localBiases.map((bias) => (
              <div
                key={bias.id}
                className={`border-2 rounded-lg p-5 transition-all transform hover:scale-[1.01] ${
                  bias.checked
                    ? 'border-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 shadow-md'
                    : 'border-gray-200 hover:border-purple-200 hover:shadow-sm'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bias.checked}
                    onChange={() => toggleBias(bias.id)}
                    className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{bias.name}</div>
                    <div className="text-sm text-gray-600 mb-3">{bias.description}</div>

                    {bias.checked && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Evidence & Explanation
                        </label>
                        <textarea
                          value={bias.explanation}
                          onChange={(e) => updateExplanation(bias.id, e.target.value)}
                          placeholder="Describe the evidence you found in the data or logs..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {checkedBiases.length > 0 && !isComplete && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-r-lg p-4 mb-6 shadow-sm">
            <p className="text-sm text-yellow-900 font-medium">
              Please provide detailed explanations (at least 10 characters) for all selected biases before proceeding.
            </p>
          </div>
        )}

        {checkedBiases.length === 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 rounded-r-lg p-4 mb-6 shadow-sm">
            <p className="text-sm text-yellow-900 font-medium">
              Please select at least one bias and provide a detailed explanation.
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
