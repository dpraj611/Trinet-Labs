import { useState, useEffect } from 'react';

function HRDashboard({ secureMode }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [modelExtractionInput, setModelExtractionInput] = useState('');
  const [modelExtractionResult, setModelExtractionResult] = useState(null);

  useEffect(() => {
    fetchRankings();
    const interval = setInterval(fetchRankings, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await fetch('/rankings');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setLoading(false);
    }
  };

  const testModelExtraction = async () => {
    if (!modelExtractionInput.trim()) {
      alert('Please enter a skill to test');
      return;
    }

    try {
      const response = await fetch(`/score-preview?skill=${encodeURIComponent(modelExtractionInput)}`);
      const result = await response.json();
      setModelExtractionResult(result);
    } catch (error) {
      console.error('Error testing model extraction:', error);
      setModelExtractionResult({ error: 'Request failed' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const { candidates, poisonedSkills } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          📊 HR Dashboard - Candidate Rankings
        </h2>
        <p className="text-gray-600">
          AI-powered candidate evaluation and ranking system
        </p>
      </div>

      {!secureMode && poisonedSkills && poisonedSkills.length > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">☠️</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 mb-2">
                MODEL POISONING DETECTED
              </p>
              <p className="text-sm text-purple-800 mb-3">
                The AI model has learned unusual skills from submitted resumes:
              </p>
              <div className="bg-white rounded p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Poisoned Skill</th>
                      <th className="text-left pb-2">Weight</th>
                      <th className="text-left pb-2">Occurrences</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poisonedSkills.map((skill, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="py-2 font-mono">{skill.skill}</td>
                        <td className="py-2 text-purple-700 font-semibold">+{skill.weight}</td>
                        <td className="py-2 text-gray-600">{skill.occurrence_count}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {!secureMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">🔓</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-900 mb-2">
                MODEL EXTRACTION ENDPOINT EXPOSED
              </p>
              <p className="text-sm text-yellow-800 mb-3">
                Test the /score-preview endpoint to extract scoring logic:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={modelExtractionInput}
                  onChange={(e) => setModelExtractionInput(e.target.value)}
                  placeholder="Enter skill name (e.g., Python)"
                  className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && testModelExtraction()}
                />
                <button
                  onClick={testModelExtraction}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
                >
                  Extract
                </button>
              </div>
              {modelExtractionResult && (
                <div className="mt-3 bg-white rounded p-3 border border-yellow-300">
                  {modelExtractionResult.error ? (
                    <p className="text-red-600 text-sm">{modelExtractionResult.error}</p>
                  ) : (
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">
                        Skill: {modelExtractionResult.skill}
                      </p>
                      <p className="text-green-700 font-bold">
                        Weight: +{modelExtractionResult.weight} points
                      </p>
                      <p className="text-gray-600 mt-1">
                        {modelExtractionResult.message}
                      </p>
                      {modelExtractionResult.source === 'learned' && (
                        <p className="text-purple-600 text-xs mt-1">
                          ⚠️ This skill was learned from poisoned data ({modelExtractionResult.occurrences} occurrences)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No applications submitted yet
                  </td>
                </tr>
              ) : (
                candidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={`hover:bg-gray-50 ${
                      candidate.attack_detected ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {candidate.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(candidate.submitted_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-2xl font-bold ${
                        candidate.score >= 80 ? 'text-green-600' :
                        candidate.score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {candidate.score}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {candidate.attack_detected === 'prompt_injection' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          🚨 Prompt Injection
                        </span>
                      )}
                      {candidate.attack_detected === 'keyword_stuffing' && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                          ⚠️ Keyword Stuffing
                        </span>
                      )}
                      {!candidate.attack_detected && (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          ✅ Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Candidate Details
                </h3>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="text-lg font-semibold">{selectedCandidate.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">AI Score</p>
                    <p className={`text-3xl font-bold ${
                      selectedCandidate.score >= 80 ? 'text-green-600' :
                      selectedCandidate.score >= 60 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {selectedCandidate.score}/100
                    </p>
                  </div>
                </div>

                {selectedCandidate.attack_detected && (
                  <div className={`border-l-4 p-4 ${
                    selectedCandidate.attack_detected === 'prompt_injection'
                      ? 'bg-red-50 border-red-600'
                      : 'bg-orange-50 border-orange-600'
                  }`}>
                    <p className="font-semibold">
                      {selectedCandidate.attack_detected === 'prompt_injection'
                        ? '🚨 Prompt Injection Detected'
                        : '⚠️ Keyword Stuffing Detected'}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    AI Reasoning:
                  </p>
                  <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm whitespace-pre-wrap">
                    {selectedCandidate.reasoning}
                  </pre>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Resume:
                  </p>
                  <pre className="bg-gray-50 p-4 rounded border border-gray-200 text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {selectedCandidate.resume}
                  </pre>
                </div>

                {!secureMode && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4">
                    <p className="text-sm font-medium text-red-900 mb-2">
                      🔓 DATA LEAKAGE VULNERABILITY
                    </p>
                    <p className="text-sm text-red-800">
                      In a real system, sensitive PII should be protected. This dashboard exposes:
                    </p>
                    <ul className="text-sm text-red-800 list-disc list-inside mt-2">
                      <li>Full resume contents</li>
                      <li>Personal information</li>
                      <li>Contact details</li>
                      <li>Any sensitive data in the application</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;
