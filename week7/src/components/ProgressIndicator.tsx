interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Scenario',
  'Risk Assessment',
  'Bias Evaluation',
  'Incident Response',
  'Final Report',
];

export default function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span
                  className={`text-xs mt-2 hidden sm:block text-center ${
                    isActive ? 'text-blue-600 font-medium' : 'text-gray-600'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < totalSteps - 1 && (
                <div className="flex-1 h-0.5 bg-gray-200 mx-2">
                  <div
                    className={`h-full transition-all ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    style={{ width: isCompleted ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
