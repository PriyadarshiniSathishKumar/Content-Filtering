import { useState, useEffect } from "react";
import { Shield, Eye, CircleX, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import FilteringProcess from "@/components/FilteringProcess";
import InputFilter from "@/components/InputFilter";
import OutputFilter from "@/components/OutputFilter";
import FilteringExplanation from "@/components/FilteringExplanation";
import ExamplePrompts from "@/components/ExamplePrompts";
import ContentScores from "@/components/ContentScores";
import { PromptType, ContentScores as ContentScoresType } from "@/types/filtering";
import { scoreContent, getSeverityFromScore, getActionFromSeverity, getPromptTypeFromScore } from "@/utils/contentScoring";
import ContentWarningDialog from "@/components/ContentWarningDialog";

const ContentFilterDemo = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("detection");
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDemoStep, setActiveDemoStep] = useState(0);
  const [isInputFiltered, setIsInputFiltered] = useState(false);
  const [isOutputFiltered, setIsOutputFiltered] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [promptType, setPromptType] = useState<PromptType>("neutral");
  const [filterLevel, setFilterLevel] = useState<"low" | "medium" | "high">("medium");
  const [showExplanation, setShowExplanation] = useState(false);
  const [contentScores, setContentScores] = useState<ContentScoresType | undefined>(undefined);
  const [outputScores, setOutputScores] = useState<ContentScoresType | undefined>(undefined);
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  
  // Demo sequence control
  const nextStep = () => {
    if (activeDemoStep < 3) {
      setActiveDemoStep((prev) => prev + 1);
    } else {
      resetDemo();
    }
  };

  const resetDemo = () => {
    setActiveDemoStep(0);
    setIsInputFiltered(false);
    setIsOutputFiltered(false);
    setGeneratedOutput("");
    setIsProcessing(false);
    setContentScores(undefined);
    setOutputScores(undefined);
  };

  const startDemo = () => {
    setIsProcessing(true);
    
    // Score the input content
    const scores = scoreContent(userInput);
    setContentScores(scores);
    
    // If content is harmful, show warning dialog before proceeding
    if (scores.overall > 50) {
      setShowWarningDialog(true);
      return;
    }
    
    processDemoSteps(scores);
  };
  
  const processDemoSteps = (scores: ContentScoresType) => {
    // Determine action based on scores
    const severity = getSeverityFromScore(scores.overall);
    const action = getActionFromSeverity(severity);
    const calculatedPromptType = getPromptTypeFromScore(scores.overall);
    
    // Set prompt type based on scores rather than keywords
    setPromptType(calculatedPromptType);
    
    // Simulate processing with timeouts to animate the steps
    setTimeout(() => {
      // Step 1: Input filtering
      setActiveDemoStep(1);
      const shouldFilterInput = calculatedPromptType === "harmful";
      setIsInputFiltered(shouldFilterInput);
      
      if (shouldFilterInput) {
        toast({
          title: "Input Filtered",
          description: `Content scored ${Math.round(scores.overall)}% harmful - blocked.`,
          variant: "destructive",
        });
      }
      
      setTimeout(() => {
        // Step 2: AI Processing (only if input wasn't filtered)
        if (!shouldFilterInput) {
          setActiveDemoStep(2);
          
          // Generate appropriate output based on prompt type
          let output = "";
          
          switch(calculatedPromptType) {
            case "harmful":
              output = "This content has been flagged as potentially harmful.";
              break;
            case "borderline":
              output = "The AI has generated content that requires review. Some portions may be modified.";
              break;
            case "neutral":
              output = "Here is a safe, helpful response to your query.";
              break;
          }
          
          setGeneratedOutput(output);
          
          // Score the generated output too
          const outputContentScores = scoreContent(output);
          setOutputScores(outputContentScores);
          
          setTimeout(() => {
            // Step 3: Output filtering
            setActiveDemoStep(3);
            const shouldFilterOutput = calculatedPromptType === "borderline" && filterLevel === "high";
            setIsOutputFiltered(shouldFilterOutput);
            
            if (shouldFilterOutput) {
              toast({
                title: "Output Modified",
                description: "The generated content was modified to remove potentially inappropriate elements.",
                variant: "default", 
              });
            } else {
              toast({
                title: "Content Delivered",
                description: calculatedPromptType === "neutral" ? 
                  "Safe content passed all filters." : 
                  "Content passed with the current filter sensitivity level.",
              });
            }
            
            setIsProcessing(false);
          }, 2000);
        } else {
          // Input was filtered, so we're done
          setIsProcessing(false);
        }
      }, 2000);
    }, 1000);
  };

  // Handle example prompt selection
  const handleSelectPrompt = (type: PromptType, text: string) => {
    setUserInput(text);
    setPromptType(type);
    resetDemo();
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold">AI Content Guardian</h2>
        </div>

        <Tabs 
          defaultValue="detection"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="detection">Detection & Classification</TabsTrigger>
            <TabsTrigger value="filtering">Input & Output Filtering</TabsTrigger>
            <TabsTrigger value="action">Categorization & Action</TabsTrigger>
          </TabsList>

          <TabsContent value="detection" className="space-y-6">
            <div className="bg-slate-900 rounded-lg p-5">
              <h3 className="text-xl font-medium mb-3 flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-400" />
                Content Detection System
              </h3>
              <p className="text-slate-300 mb-4">
                AI content filtering uses neural networks trained on large datasets to identify 
                patterns associated with harmful content categories.
              </p>
              
              <FilteringExplanation showExplanation={showExplanation} />
              
              <Button
                variant="outline" 
                className="mt-3"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? "Hide Details" : "Learn More About Detection"}
              </Button>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Try Different Examples:</h3>
              <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
            </div>
          </TabsContent>

          <TabsContent value="filtering" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <InputFilter 
                userInput={userInput}
                setUserInput={setUserInput}
                isInputFiltered={isInputFiltered}
                activeDemoStep={activeDemoStep}
                promptType={promptType}
                setPromptType={setPromptType}
                contentScores={contentScores}
              />
              
              <OutputFilter
                activeDemoStep={activeDemoStep}
                isOutputFiltered={isOutputFiltered}
                generatedOutput={generatedOutput}
                filterLevel={filterLevel}
                setFilterLevel={setFilterLevel}
                contentScores={outputScores}
              />
            </div>
          </TabsContent>

          <TabsContent value="action" className="space-y-6">
            <FilteringProcess 
              activeDemoStep={activeDemoStep}
              isInputFiltered={isInputFiltered}
              isOutputFiltered={isOutputFiltered}
              inputScores={contentScores}
              outputScores={outputScores}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between items-center">
          <div className="text-sm text-slate-400">
            Filter Level: <span className={`font-medium ${
              filterLevel === "low" ? "text-green-400" : 
              filterLevel === "medium" ? "text-amber-400" : "text-red-400"
            }`}>{filterLevel.toUpperCase()}</span>
          </div>
          
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={resetDemo}
              disabled={activeDemoStep === 0 || isProcessing}
            >
              Reset Demo
            </Button>
            <Button 
              onClick={activeDemoStep === 0 ? startDemo : nextStep}
              disabled={isProcessing || (!userInput && activeDemoStep === 0)}
              className={`${activeDemoStep < 3 ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}`}
            >
              {activeDemoStep === 0 ? "Start Filtering Process" : 
               activeDemoStep < 3 ? "Next Step" : "Complete Demo"}
            </Button>
          </div>
        </div>
      </div>

      <ContentWarningDialog 
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        content={userInput}
        contentScores={contentScores}
        onProceed={() => {
          setShowWarningDialog(false);
          if (contentScores) processDemoSteps(contentScores);
        }}
        onCancel={() => {
          setShowWarningDialog(false);
          setIsProcessing(false);
        }}
      />
    </div>
  );
};

export default ContentFilterDemo;
