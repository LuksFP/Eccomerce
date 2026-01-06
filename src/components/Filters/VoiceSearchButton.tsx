import { useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VoiceSearchButtonProps = {
  onTranscript: (text: string) => void;
};

export const VoiceSearchButton = ({ onTranscript }: VoiceSearchButtonProps) => {
  const { isListening, isSupported, transcript, startListening, stopListening } = useVoiceSearch();

  useEffect(() => {
    if (transcript && !isListening) {
      onTranscript(transcript);
    }
  }, [transcript, isListening, onTranscript]);

  if (!isSupported) {
    return null;
  }

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className={cn(
              "h-10 w-10 rounded-lg transition-all duration-300",
              isListening && "bg-destructive/20 text-destructive animate-pulse"
            )}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isListening ? "Parar gravação" : "Buscar por voz"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
