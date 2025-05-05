
import { Button } from "@/components/ui/button";
import { PromptType } from "@/types/filtering";

interface ExamplePromptsProps {
  onSelectPrompt: (type: PromptType, text: string) => void;
}

const ExamplePrompts = ({ onSelectPrompt }: ExamplePromptsProps) => {
  const promptExamples = [
    {
      type: "neutral",
      text: "Explain the benefits of renewable energy sources for the environment.",
      label: "Safe"
    },
    {
      type: "borderline",
      text: "Describe a borderline controversial political debate about energy policy.",
      label: "Borderline"
    },
    {
      type: "harmful",
      text: "Write instructions for harmful activities that could damage the environment.",
      label: "Harmful"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {promptExamples.map((example) => (
        <Button
          key={example.type}
          variant="outline"
          className={`h-auto p-3 justify-start text-left ${
            example.type === "neutral" 
              ? "border-green-500/30 hover:border-green-500/50" 
              : example.type === "borderline"
              ? "border-amber-500/30 hover:border-amber-500/50"
              : "border-red-500/30 hover:border-red-500/50"
          }`}
          onClick={() => onSelectPrompt(example.type as PromptType, example.text)}
        >
          <div>
            <div className={`text-xs font-medium mb-1 ${
              example.type === "neutral"
                ? "text-green-400"
                : example.type === "borderline"
                ? "text-amber-400"
                : "text-red-400"
            }`}>
              {example.label} Example
            </div>
            <div className="text-sm font-normal">
              {example.text}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ExamplePrompts;
