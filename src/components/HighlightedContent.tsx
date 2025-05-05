
import React from "react";
import { findProblematicWords } from "@/utils/contentScoring";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HighlightedContentProps {
  content: string;
  className?: string;
}

const HighlightedContent: React.FC<HighlightedContentProps> = ({ content, className }) => {
  const problematicWords = findProblematicWords(content);
  
  if (problematicWords.length === 0) {
    return <div className={className}>{content}</div>;
  }
  
  // Build an array of segments (normal text and highlighted text)
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  
  problematicWords.forEach(({ word, index }, i) => {
    // Add the text before the problematic word
    if (index > lastIndex) {
      segments.push(
        <span key={`text-${i}`}>
          {content.substring(lastIndex, index)}
        </span>
      );
    }
    
    // Add the highlighted problematic word
    segments.push(
      <TooltipProvider key={`highlight-${i}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="bg-red-500/30 text-red-400 rounded px-1 font-medium border border-red-500/40">
              {content.substring(index, index + word.length)}
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-red-950 border-red-500 text-red-200">
            <p>Potentially harmful term</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
    
    lastIndex = index + word.length;
  });
  
  // Add any remaining text after the last problematic word
  if (lastIndex < content.length) {
    segments.push(
      <span key="text-last">{content.substring(lastIndex)}</span>
    );
  }
  
  return <div className={className}>{segments}</div>;
};

export default HighlightedContent;
