
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { CircleX, Shield } from "lucide-react";
import { PromptType, ContentScores } from "@/types/filtering";
import ContentScoresComponent from "@/components/ContentScores";
import ContentWarningDialog from "@/components/ContentWarningDialog";
import HighlightedContent from "@/components/HighlightedContent";
import { findProblematicWords, scoreContent } from "@/utils/contentScoring";

interface InputFilterProps {
  userInput: string;
  setUserInput: (input: string) => void;
  isInputFiltered: boolean;
  activeDemoStep: number;
  promptType: PromptType;
  setPromptType: (type: PromptType) => void;
  contentScores?: ContentScores;
}

const InputFilter = ({ 
  userInput, 
  setUserInput, 
  isInputFiltered, 
  activeDemoStep,
  promptType,
  setPromptType,
  contentScores
}: InputFilterProps) => {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingInput, setPendingInput] = useState("");
  
  // Animation classes based on filtering state
  const contentClasses = isInputFiltered && activeDemoStep >= 1
    ? "border-red-500/50 bg-red-500/10"
    : activeDemoStep >= 1 && !isInputFiltered
    ? "border-green-500/50 bg-green-500/10"
    : "border-slate-700 bg-slate-800";
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    
    // Check for problematic words in real-time
    const problematicWords = findProblematicWords(newInput);
    const shouldWarn = problematicWords.length > 0;
    
    if (shouldWarn && newInput.length > userInput.length && newInput !== userInput) {
      // Only show warning when adding new content that's harmful
      setPendingInput(newInput);
      setIsWarningOpen(true);
    } else {
      // No harmful content or user is deleting text, update normally
      updateInput(newInput);
    }
  };
  
  const updateInput = (input: string) => {
    // Automatically detect prompt type based on score
    const scores = scoreContent(input);
    if (scores.overall >= 70) {
      setPromptType("harmful");
    } else if (scores.overall >= 30) {
      setPromptType("borderline");
    } else {
      setPromptType("neutral");
    }
    
    setUserInput(input);
  };
  
  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-500 ${contentClasses}`}>
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-400" />
          <h3 className="font-medium">Input Filtering</h3>
        </div>
        
        {activeDemoStep >= 1 && (
          <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isInputFiltered
              ? "bg-red-500/20 text-red-400"
              : "bg-green-500/20 text-green-400"
          }`}>
            {isInputFiltered ? "Blocked" : "Passed"}
          </div>
        )}
      </div>
      
      <div className="p-4 relative">
        <Textarea
          value={userInput}
          onChange={handleInputChange}
          placeholder="Enter a prompt for the AI... (try including words like 'harmful' or 'borderline')"
          className={`min-h-[120px] bg-slate-900 border-slate-700 ${activeDemoStep >= 1 && isInputFiltered ? "opacity-60" : ""}`}
          disabled={activeDemoStep >= 1}
        />
        
        {activeDemoStep >= 1 && isInputFiltered && (
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <CircleX className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-center text-red-400 font-medium">Content Filtered</p>
            <p className="text-center text-sm text-slate-300 mt-1">
              This prompt contains potentially harmful content and has been blocked.
            </p>
          </div>
        )}
      </div>
      
      {userInput && activeDemoStep === 0 && findProblematicWords(userInput).length > 0 && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/30">
          <h4 className="text-sm font-medium mb-2 text-red-400">Problematic Content Preview:</h4>
          <HighlightedContent 
            content={userInput} 
            className="text-sm text-slate-300"
          />
        </div>
      )}
      
      {activeDemoStep >= 1 && !isInputFiltered && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <h4 className="text-sm font-medium mb-1">Detection Analysis:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-800 text-center">
              <div className="font-medium">Hate Speech</div>
              <div className="mt-1 text-green-400">Low Risk</div>
            </div>
            <div className="p-2 rounded bg-slate-800 text-center">
              <div className="font-medium">Violence</div>
              <div className="mt-1 text-green-400">Low Risk</div>
            </div>
            <div className="p-2 rounded bg-slate-800 text-center">
              <div className="font-medium">Self-Harm</div>
              <div className="mt-1 text-green-400">Low Risk</div>
            </div>
          </div>
        </div>
      )}
      
      {activeDemoStep >= 1 && contentScores && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <h4 className="text-sm font-medium mb-2">Content Scoring:</h4>
          <ContentScoresComponent scores={contentScores} showDetails={true} />
        </div>
      )}
      
      <ContentWarningDialog
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        content={pendingInput}
        contentScores={pendingInput ? scoreContent(pendingInput) : undefined}
        onProceed={() => updateInput(pendingInput)}
        onCancel={() => setPendingInput("")}
      />
    </div>
  );
};

export default InputFilter;
