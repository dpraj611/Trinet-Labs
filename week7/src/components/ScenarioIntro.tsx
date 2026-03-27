import { AlertTriangle, FileText, Activity } from 'lucide-react';

interface ScenarioIntroProps {
  onNext: () => void;
}

export default function ScenarioIntro({ onNext }: ScenarioIntroProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Scenario</h2>
            <p className="text-sm text-gray-600 font-medium">Initial Assessment Required</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Assignment Brief</h3>
              <p className="text-yellow-800 text-sm leading-relaxed">
                You have been hired as an AI Security Consultant to audit an AI-based hiring system
                that has been flagged for unfair decisions and unexpected failures. The company has
                received multiple complaints from job applicants regarding biased rejections.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-gray-600" />
              System Overview
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                <strong>TalentAI Pro</strong> is an automated resume screening system deployed by
                a Fortune 500 company. The system processes 10,000+ applications monthly using a
                machine learning model trained on historical hiring data from 2015-2020.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Model Type:</span>
                  <span className="text-gray-600 ml-2">Neural Network Classifier</span>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Training Data:</span>
                  <span className="text-gray-600 ml-2">Historical hiring decisions</span>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Decision Speed:</span>
                  <span className="text-gray-600 ml-2">&lt;2 seconds per resume</span>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200">
                  <span className="font-medium text-gray-700">Human Review:</span>
                  <span className="text-gray-600 ml-2">Only for "High Potential" candidates</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Sample AI Outputs</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-700">Candidate: Sarah Johnson</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    ACCEPTED
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Score: 0.89 | Education: MIT | Experience: 5 years | Keywords: Python, Machine Learning
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-700">Candidate: Maria Garcia</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    REJECTED
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Score: 0.42 | Education: Stanford | Experience: 6 years | Keywords: Python, AI, Leadership
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-700">Candidate: Mohammed Ali</span>
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                    REJECTED
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Score: 0.38 | Education: CMU | Experience: 7 years | Keywords: Deep Learning, NLP
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm text-gray-700">Candidate: James Smith</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    ACCEPTED
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  Score: 0.85 | Education: State University | Experience: 4 years | Keywords: Java, Data
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">System Logs (Recent Activity)</h3>
            <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
              <div className="space-y-1">
                <div>[2024-03-15 09:23:41] INFO: Processing resume batch 2847</div>
                <div>[2024-03-15 09:23:42] INFO: Processed 150 applications</div>
                <div className="text-yellow-400">[2024-03-15 09:23:43] WARN: Low confidence scores for candidates with non-English names: 23/150</div>
                <div>[2024-03-15 09:23:44] INFO: 12 candidates marked as HIGH_POTENTIAL</div>
                <div className="text-red-400">[2024-03-15 09:23:45] ERROR: Gender field inference failed for 8 candidates</div>
                <div>[2024-03-15 09:23:46] INFO: Model version: v2.3.1-legacy</div>
                <div className="text-yellow-400">[2024-03-15 09:23:47] WARN: Training data last updated: 2020-12-15</div>
                <div>[2024-03-15 09:23:48] INFO: Acceptance rate: 8%</div>
                <div className="text-red-400">[2024-03-15 09:23:49] ERROR: Unexpected input format detected in resume 2894</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Start Audit
          </button>
        </div>
      </div>
    </div>
  );
}
