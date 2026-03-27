import { useState } from 'react';
import ProgressIndicator from './components/ProgressIndicator';
import ScenarioIntro from './components/ScenarioIntro';
import RiskAssessment from './components/RiskAssessment';
import BiasEvaluation from './components/BiasEvaluation';
import IncidentResponse from './components/IncidentResponse';
import FinalReport from './components/FinalReport';

export interface Risk {
  id: string;
  name: string;
  severity: 'Low' | 'Medium' | 'High' | '';
  likelihood: 'Low' | 'Medium' | 'High' | '';
  notes: string;
}

export interface BiasItem {
  id: string;
  name: string;
  description: string;
  checked: boolean;
  explanation: string;
}

export interface IncidentResponseData {
  immediateAction: string;
  containment: string[];
  longTermFix: string[];
}

export interface AuditData {
  risks: Risk[];
  biases: BiasItem[];
  incidentResponse: IncidentResponseData;
  biasScore: number;
  incidentScore: number;
  passed: boolean;
}

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [auditData, setAuditData] = useState<AuditData>({
    risks: [],
    biases: [],
    incidentResponse: {
      immediateAction: '',
      containment: [],
      longTermFix: [],
    },
    biasScore: 0,
    incidentScore: 0,
    passed: false,
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateRisks = (risks: Risk[]) => {
    setAuditData({ ...auditData, risks });
  };

  const updateBiases = (biases: BiasItem[], score: number) => {
    setAuditData({ ...auditData, biases, biasScore: score });
  };

  const updateIncidentResponse = (incidentResponse: IncidentResponseData, score: number) => {
    const totalScore = auditData.biasScore + score;
    const passed = totalScore >= 150;
    setAuditData({ ...auditData, incidentResponse, incidentScore: score, passed });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            AI Security Audit Tool
          </h1>
          <p className="text-sm text-gray-600 mt-1 font-medium">
            Week 7: AI Risk Assessment & Governance Lab
          </p>
        </div>
      </header>

      {currentStep > 1 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 1 && <ScenarioIntro onNext={handleNext} />}
        {currentStep === 2 && (
          <RiskAssessment
            risks={auditData.risks}
            onUpdate={updateRisks}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <BiasEvaluation
            biases={auditData.biases}
            onUpdate={updateBiases}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 4 && (
          <IncidentResponse
            incidentResponse={auditData.incidentResponse}
            onUpdate={updateIncidentResponse}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        {currentStep === 5 && (
          <FinalReport auditData={auditData} onBack={handleBack} />
        )}
      </main>
    </div>
  );
}

export default App;
