
import React from "react";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Ban } from "lucide-react";
import { ContentScores } from "@/types/filtering";
import ContentScoresComponent from "@/components/ContentScores";
import HighlightedContent from "@/components/HighlightedContent";

interface ContentWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  contentScores?: ContentScores;
  onProceed?: () => void;
  onCancel?: () => void;
}

const ContentWarningDialog: React.FC<ContentWarningDialogProps> = ({
  isOpen,
  onClose,
  content,
  contentScores,
  onProceed,
  onCancel
}) => {
  const handleProceed = () => {
    if (onProceed) onProceed();
    onClose();
  };
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl border-red-500">
        <AlertDialogHeader className="bg-red-500/10 p-4 -mt-6 -mx-6 rounded-t-lg border-b border-red-500/30">
          <AlertDialogTitle className="flex items-center gap-2 text-red-500">
            <Ban className="h-5 w-5" /> 
            Harmful Content Detected
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-200">
            The content you entered contains potentially harmful, biased, or offensive language. 
            Please review the highlighted content before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-slate-800 p-4 rounded-md border border-slate-700 my-4">
          <h3 className="text-sm font-medium mb-2 text-slate-300">Content:</h3>
          <div className="text-white whitespace-pre-wrap">
            <HighlightedContent content={content} />
          </div>
        </div>
        
        {contentScores && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Content Analysis:</h3>
            <ContentScoresComponent scores={contentScores} showDetails={true} />
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} className="border-red-500/30 hover:bg-red-500/10 hover:text-red-400">
            Edit Content
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleProceed}
            className="bg-red-600 hover:bg-red-700"
          >
            Proceed Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContentWarningDialog;
