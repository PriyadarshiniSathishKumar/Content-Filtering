
import { Shield, CircleX, ShieldCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ContentScores from "@/components/ContentScores";
import { ContentScores as ContentScoresType } from "@/types/filtering";

interface FilteringProcessProps {
  activeDemoStep: number;
  isInputFiltered: boolean;
  isOutputFiltered: boolean;
  inputScores?: ContentScoresType;
  outputScores?: ContentScoresType;
}

const FilteringProcess = ({ 
  activeDemoStep, 
  isInputFiltered, 
  isOutputFiltered,
  inputScores,
  outputScores
}: FilteringProcessProps) => {
  const steps = [
    { id: 0, name: "Start", status: "complete" },
    { id: 1, name: "Input Filtering", status: activeDemoStep >= 1 ? "complete" : "upcoming" },
    { id: 2, name: "AI Processing", status: activeDemoStep >= 2 ? "complete" : isInputFiltered ? "skipped" : "upcoming" },
    { id: 3, name: "Output Filtering", status: activeDemoStep >= 3 ? "complete" : isInputFiltered ? "skipped" : "upcoming" },
  ];

  // Calculate progress percentage
  const progressPercentage = (activeDemoStep / (steps.length - 1)) * 100;
  
  return (
    <div className="bg-slate-900 rounded-lg p-5">
      <h3 className="text-xl font-medium mb-4">Filtering Process</h3>
      
      <div className="mb-8">
        <Progress 
          value={progressPercentage} 
          className="h-2" 
        />
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center p-3 rounded-lg border ${
              step.status === 'complete' ? 'bg-slate-800 border-slate-700' : 
              step.status === 'skipped' ? 'bg-slate-800/50 border-slate-700/50 opacity-60' : 
              'bg-slate-800/30 border-slate-700/30'
            }`}
          >
            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full ${
              step.status === 'complete' ? 'bg-green-500/20 text-green-500' : 
              step.status === 'skipped' ? 'bg-slate-600/20 text-slate-400' : 
              'bg-slate-700/20 text-slate-500'
            }`}>
              {step.status === 'complete' && <ShieldCheck className="w-4 h-4" />}
              {step.status === 'skipped' && <CircleX className="w-4 h-4" />}
              {step.status === 'upcoming' && <Shield className="w-4 h-4" />}
            </div>

            <div className="ml-4 flex-1">
              <p className="font-medium">{step.name}</p>
              <p className="text-sm text-slate-400">
                {step.id === 1 && activeDemoStep >= 1 && (
                  isInputFiltered ? 
                    `Harmful content detected in input (${inputScores ? Math.round(inputScores.overall) + '% harmful' : ''}). Process stopped.` : 
                    `Input passed safety checks (${inputScores ? Math.round(inputScores.overall) + '% harmful' : ''}). Proceeding to AI processing.`
                )}
                {step.id === 2 && activeDemoStep >= 2 && (
                  "AI generating content based on the filtered input."
                )}
                {step.id === 3 && activeDemoStep >= 3 && (
                  isOutputFiltered ? 
                    `Output contained problematic elements (${outputScores ? Math.round(outputScores.overall) + '% harmful' : ''}). Content modified.` : 
                    `Content passed output filtering (${outputScores ? Math.round(outputScores.overall) + '% harmful' : ''}). Safe to deliver.`
                )}
                {(step.status === 'upcoming' || (step.id !== 1 && step.id !== 2 && step.id !== 3)) && (
                  "Waiting to be processed..."
                )}
                {step.status === 'skipped' && step.id > 1 && (
                  "Step skipped due to input filtering."
                )}
              </p>
            </div>

            <div className="ml-4">
              {step.status === 'complete' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                  Complete
                </span>
              )}
              {step.status === 'skipped' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/20 text-slate-400">
                  Skipped
                </span>
              )}
              {step.status === 'upcoming' && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700/20 text-slate-500">
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-800/50">
        <h4 className="font-medium mb-2">Action Taken:</h4>
        <p className="text-slate-300">
          {activeDemoStep === 0 && (
            "Start the demo to see the filtering process in action."
          )}
          {activeDemoStep >= 1 && isInputFiltered && (
            "Input content blocked due to potential harmful content. User should modify their prompt."
          )}
          {activeDemoStep >= 3 && !isInputFiltered && isOutputFiltered && (
            "AI output modified to remove potentially harmful content before delivery to user."
          )}
          {activeDemoStep >= 3 && !isInputFiltered && !isOutputFiltered && (
            "Content passed all filtering checks and was delivered safely to the user."
          )}
          {activeDemoStep > 0 && activeDemoStep < 3 && !isInputFiltered && (
            "Processing content..."
          )}
        </p>
      </div>
      
      {activeDemoStep >= 1 && inputScores && (
        <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-800/50">
          <h4 className="font-medium mb-2">Input Content Risk Assessment:</h4>
          <ContentScores scores={inputScores} />
        </div>
      )}
      
      {activeDemoStep >= 2 && !isInputFiltered && outputScores && (
        <div className="mt-6 p-4 rounded-lg border border-slate-700 bg-slate-800/50">
          <h4 className="font-medium mb-2">Output Content Risk Assessment:</h4>
          <ContentScores scores={outputScores} />
        </div>
      )}
    </div>
  );
};

export default FilteringProcess;
