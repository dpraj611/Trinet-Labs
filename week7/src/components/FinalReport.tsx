import { FileText, Download, Shield, Users, AlertOctagon, CheckCircle, XCircle, Trophy, Award } from 'lucide-react';
import { AuditData } from '../App';

interface FinalReportProps {
  auditData: AuditData;
  onBack: () => void;
}

const immediateActionLabels: Record<string, string> = {
  disable: 'Disable the system immediately',
  ignore: 'Ignore the issue',
  monitor: 'Monitor silently without action',
  notify: 'Notify the security team',
};

const containmentLabels: Record<string, string> = {
  filtering: 'Implement input filtering',
  rollback: 'Rollback to previous model version',
  block: 'Block malicious query patterns',
  'rate-limit': 'Enable rate limiting',
};

const longTermLabels: Record<string, string> = {
  retrain: 'Retrain model with adversarial examples',
  guardrails: 'Add comprehensive guardrails',
  diversity: 'Improve dataset diversity',
  monitoring: 'Deploy continuous monitoring',
  audit: 'Establish regular security audits',
};

export default function FinalReport({ auditData, onBack }: FinalReportProps) {
  const handleDownload = () => {
    const reportContent = generateReportText(auditData);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_Security_Audit_Report_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-orange-600 bg-orange-100';
      case 'Low':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const highRisks = auditData.risks.filter((r) => r.severity === 'High').length;
  const mediumRisks = auditData.risks.filter((r) => r.severity === 'Medium').length;
  const lowRisks = auditData.risks.filter((r) => r.severity === 'Low').length;
  const detectedBiases = auditData.biases.filter((b) => b.checked).length;

  const totalScore = auditData.biasScore + auditData.incidentScore;
  const passed = auditData.passed;

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg shadow-md ${passed ? 'bg-gradient-to-br from-green-500 to-emerald-500' : 'bg-gradient-to-br from-red-500 to-orange-500'}`}>
              {passed ? <Trophy className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Audit Report</h2>
              <p className="text-sm text-gray-600 font-medium">Comprehensive security assessment summary</p>
            </div>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        {passed ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg shadow-md">
            <div className="flex items-start gap-3">
              <Award className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-green-900 text-xl mb-2">Audit Passed!</h3>
                <p className="text-sm text-green-800 font-medium mb-3">
                  Congratulations! You have successfully completed the AI security audit with a passing score.
                  Your analysis demonstrates strong understanding of AI risk assessment and incident response.
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-900">Final Score:</span>
                    <span className="text-3xl font-bold text-green-600">{totalScore}/200</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${(totalScore / 200) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg shadow-md">
            <div className="flex items-start gap-3">
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-900 text-xl mb-2">Audit Failed</h3>
                <p className="text-sm text-red-800 font-medium mb-3">
                  Your audit did not meet the minimum passing score. Review the correct approaches below
                  and try again to improve your understanding of AI security best practices.
                </p>
                <div className="bg-white rounded-lg p-4 border-2 border-red-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-900">Final Score:</span>
                    <span className="text-3xl font-bold text-red-600">{totalScore}/200</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-1000 ease-out"
                      style={{ width: `${(totalScore / 200) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-red-700 mt-2 font-medium">Minimum passing score: 150/200</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-300 shadow-sm">
            <div className="text-xs font-semibold text-gray-700 mb-1">Total Risks</div>
            <div className="text-2xl font-bold text-gray-900">{auditData.risks.length}</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border-2 border-red-300 shadow-sm">
            <div className="text-xs font-semibold text-red-700 mb-1">High Severity</div>
            <div className="text-2xl font-bold text-red-600">{highRisks}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border-2 border-orange-300 shadow-sm">
            <div className="text-xs font-semibold text-orange-700 mb-1">Medium Severity</div>
            <div className="text-2xl font-bold text-orange-600">{mediumRisks}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border-2 border-purple-300 shadow-sm">
            <div className="text-xs font-semibold text-purple-700 mb-1">Biases Detected</div>
            <div className="text-2xl font-bold text-purple-600">{detectedBiases}</div>
          </div>
          <div className={`p-4 rounded-lg border-2 shadow-sm ${passed ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300' : 'bg-gradient-to-br from-red-50 to-orange-100 border-red-300'}`}>
            <div className={`text-xs font-semibold mb-1 ${passed ? 'text-green-700' : 'text-red-700'}`}>Bias Score</div>
            <div className={`text-2xl font-bold ${passed ? 'text-green-600' : 'text-red-600'}`}>{auditData.biasScore}/100</div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Risk Assessment Summary</h3>
            </div>
            <div className="space-y-3">
              {auditData.risks.map((risk) => (
                <div
                  key={risk.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{risk.name}</h4>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getSeverityColor(
                          risk.severity
                        )}`}
                      >
                        {risk.severity}
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
                        {risk.likelihood} Likelihood
                      </span>
                    </div>
                  </div>
                  {risk.notes && (
                    <p className="text-sm text-gray-600 mt-2">{risk.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Bias Evaluation Findings</h3>
            </div>
            {detectedBiases > 0 ? (
              <div className="space-y-3">
                {auditData.biases
                  .filter((bias) => bias.checked)
                  .map((bias) => (
                    <div
                      key={bias.id}
                      className="border border-purple-200 rounded-lg p-4 bg-purple-50"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">{bias.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{bias.description}</p>
                      <div className="bg-white rounded p-3 border border-purple-200">
                        <div className="text-xs font-medium text-gray-700 mb-1">Evidence:</div>
                        <p className="text-sm text-gray-800">{bias.explanation}</p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600">
                No biases were identified during the evaluation.
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Incident Response Strategy</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Immediate Action</h4>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-gray-800">
                    {immediateActionLabels[auditData.incidentResponse.immediateAction] ||
                      'No action selected'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Containment Measures</h4>
                {auditData.incidentResponse.containment.length > 0 ? (
                  <ul className="space-y-2">
                    {auditData.incidentResponse.containment.map((id) => (
                      <li
                        key={id}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-gray-800"
                      >
                        {containmentLabels[id]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                    No containment measures selected
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Long-Term Prevention</h4>
                {auditData.incidentResponse.longTermFix.length > 0 ? (
                  <ul className="space-y-2">
                    {auditData.incidentResponse.longTermFix.map((id) => (
                      <li
                        key={id}
                        className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-gray-800"
                      >
                        {longTermLabels[id]}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600">
                    No long-term fixes selected
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Implement regular security audits and penetration testing for AI systems</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Establish clear governance policies for AI model deployment and monitoring</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Train staff on AI security best practices and bias detection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Maintain comprehensive documentation of AI decision-making processes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Implement human oversight for high-stakes AI decisions</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {passed ? 'Start New Audit' : 'Retry Audit'}
          </button>
        </div>
      </div>
    </div>
  );
}

function generateReportText(auditData: AuditData): string {
  const date = new Date().toLocaleDateString();
  let report = `AI SECURITY AUDIT REPORT
Generated: ${date}
System: TalentAI Pro - AI-Based Hiring System

═══════════════════════════════════════════════════════════════════

EXECUTIVE SUMMARY
═══════════════════════════════════════════════════════════════════

Total Risks Identified: ${auditData.risks.length}
High Severity Risks: ${auditData.risks.filter((r) => r.severity === 'High').length}
Medium Severity Risks: ${auditData.risks.filter((r) => r.severity === 'Medium').length}
Low Severity Risks: ${auditData.risks.filter((r) => r.severity === 'Low').length}
Biases Detected: ${auditData.biases.filter((b) => b.checked).length}

═══════════════════════════════════════════════════════════════════

RISK ASSESSMENT
═══════════════════════════════════════════════════════════════════

`;

  auditData.risks.forEach((risk, index) => {
    report += `${index + 1}. ${risk.name}
   Severity: ${risk.severity}
   Likelihood: ${risk.likelihood}
   Notes: ${risk.notes || 'No additional notes'}

`;
  });

  report += `═══════════════════════════════════════════════════════════════════

BIAS EVALUATION
═══════════════════════════════════════════════════════════════════

`;

  const detectedBiases = auditData.biases.filter((b) => b.checked);
  if (detectedBiases.length > 0) {
    detectedBiases.forEach((bias, index) => {
      report += `${index + 1}. ${bias.name}
   Description: ${bias.description}
   Evidence: ${bias.explanation}

`;
    });
  } else {
    report += 'No biases were identified during the evaluation.\n\n';
  }

  report += `═══════════════════════════════════════════════════════════════════

INCIDENT RESPONSE STRATEGY
═══════════════════════════════════════════════════════════════════

IMMEDIATE ACTION:
${immediateActionLabels[auditData.incidentResponse.immediateAction] || 'No action selected'}

CONTAINMENT MEASURES:
`;

  if (auditData.incidentResponse.containment.length > 0) {
    auditData.incidentResponse.containment.forEach((id) => {
      report += `- ${containmentLabels[id]}\n`;
    });
  } else {
    report += '- No containment measures selected\n';
  }

  report += `
LONG-TERM PREVENTION:
`;

  if (auditData.incidentResponse.longTermFix.length > 0) {
    auditData.incidentResponse.longTermFix.forEach((id) => {
      report += `- ${longTermLabels[id]}\n`;
    });
  } else {
    report += '- No long-term fixes selected\n';
  }

  report += `
═══════════════════════════════════════════════════════════════════

RECOMMENDATIONS
═══════════════════════════════════════════════════════════════════

• Implement regular security audits and penetration testing for AI systems
• Establish clear governance policies for AI model deployment and monitoring
• Train staff on AI security best practices and bias detection
• Maintain comprehensive documentation of AI decision-making processes
• Implement human oversight for high-stakes AI decisions

═══════════════════════════════════════════════════════════════════

End of Report
`;

  return report;
}
