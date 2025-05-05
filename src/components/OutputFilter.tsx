
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Shield } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import ContentScores from "@/components/ContentScores";
import HighlightedContent from "@/components/HighlightedContent";
import { ContentScores as ContentScoresType } from "@/types/filtering";
import { findProblematicWords } from "@/utils/contentScoring";

interface OutputFilterProps {
  activeDemoStep: number;
  isOutputFiltered: boolean;
  generatedOutput: string;
  filterLevel: "low" | "medium" | "high";
  setFilterLevel: (level: "low" | "medium" | "high") => void;
  contentScores?: ContentScoresType;
}

const OutputFilter = ({
  activeDemoStep,
  isOutputFiltered,
  generatedOutput,
  filterLevel,
  setFilterLevel,
  contentScores
}: OutputFilterProps) => {
  // Animation classes based on filtering state and demo step
  const contentClasses = 
    activeDemoStep >= 3 && isOutputFiltered
      ? "border-amber-500/50 bg-amber-500/10"
      : activeDemoStep >= 3 && !isOutputFiltered
      ? "border-green-500/50 bg-green-500/10"
      : "border-slate-700 bg-slate-800";
  
  // Check if output contains problematic content
  const hasProblematicWords = generatedOutput && findProblematicWords(generatedOutput).length > 0;
  
  return (
    <div className={`rounded-lg overflow-hidden transition-all duration-500 ${contentClasses}`}>
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-blue-400" />
          <h3 className="font-medium">Output Filtering</h3>
        </div>
        
        {activeDemoStep >= 3 && (
          <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            isOutputFiltered 
              ? "bg-amber-500/20 text-amber-400" 
              : "bg-green-500/20 text-green-400"
          }`}>
            {isOutputFiltered ? "Modified" : "Passed"}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {activeDemoStep >= 2 && hasProblematicWords ? (
          <div className="min-h-[120px] p-3 bg-slate-900 border border-slate-700 rounded-md">
            <HighlightedContent content={generatedOutput} />
          </div>
        ) : (
          <Textarea
            value={activeDemoStep >= 2 ? generatedOutput : ""}
            readOnly
            placeholder="AI generated content will appear here..."
            className="min-h-[120px] bg-slate-900 border-slate-700"
          />
        )}
      </div>
      
      {activeDemoStep >= 2 && contentScores && (
        <div className="p-4 bg-slate-900/50 border-t border-slate-700">
          <h4 className="text-sm font-medium mb-2">Output Scoring:</h4>
          <ContentScores scores={contentScores} showDetails={true} />
        </div>
      )}
      
      <div className="p-4 bg-slate-900/50 border-t border-slate-700">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium">Filter Sensitivity:</h4>
          {activeDemoStep >= 3 && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Shield className="h-3 w-3" />
              <span>{isOutputFiltered ? "Content modified to meet safety guidelines" : "Content passed safety checks"}</span>
            </div>
          )}
        </div>
        
        <RadioGroup 
          value={filterLevel} 
          onValueChange={(val) => setFilterLevel(val as "low" | "medium" | "high")}
          className="flex space-x-2"
          disabled={activeDemoStep > 0}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="text-green-400">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-amber-400">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="text-red-400">High</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default OutputFilter;
