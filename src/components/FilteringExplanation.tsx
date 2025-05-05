
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilteringExplanationProps {
  showExplanation: boolean;
}

const FilteringExplanation = ({ showExplanation }: FilteringExplanationProps) => {
  const [activeTab, setActiveTab] = useState("detection");
  
  if (!showExplanation) return null;
  
  return (
    <div className="mt-4 bg-slate-950 rounded-lg p-4 border border-slate-700 animate-fade-in">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="detection">Detection</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detection" className="space-y-3">
          <h4 className="font-medium text-purple-400">How Detection Works</h4>
          <p className="text-sm text-slate-300">
            GenAI content filtering systems use deep learning models to analyze text, images, 
            or other content. These models examine both explicit content (like specific words) 
            and contextual patterns and semantic meaning.
          </p>
          <p className="text-sm text-slate-300">
            Detection happens at multiple stages - when the user provides input, during AI processing, 
            and before delivering the output to ensure comprehensive safety.
          </p>
        </TabsContent>
        
        <TabsContent value="classification" className="space-y-3">
          <h4 className="font-medium text-blue-400">Content Classification</h4>
          <p className="text-sm text-slate-300">
            Content is classified into categories like:
          </p>
          <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
            <li>Hate Speech/Discrimination</li>
            <li>Violence/Threats</li>
            <li>Self-harm/Suicide</li>
            <li>Sexual Content</li>
            <li>Harassment/Bullying</li>
            <li>Illegal Activity</li>
            <li>Misinformation</li>
          </ul>
          <p className="text-sm text-slate-300">
            For each category, content is assigned a risk score that determines the appropriate action.
          </p>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-3">
          <h4 className="font-medium text-green-400">ML Model Architecture</h4>
          <p className="text-sm text-slate-300">
            Content filtering models often use architectures like:
          </p>
          <ul className="text-sm text-slate-300 list-disc pl-5 space-y-1">
            <li>Transformer-based neural networks (similar to BERT, GPT)</li>
            <li>Multi-label classification systems</li>
            <li>Ensemble approaches combining multiple specialized models</li>
            <li>Fine-tuned models for specific content domains</li>
          </ul>
          <p className="text-sm text-slate-300">
            These models require constant updating with new training data to keep up with evolving content patterns.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FilteringExplanation;
