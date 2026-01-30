import { useState } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder, useVoiceStream } from "@/replit_integrations/audio";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  conversationId?: number; // Optional, defaults to a "scratch" conversation context if not provided
}

export function VoiceInput({ onTranscript, className, conversationId = 1 }: VoiceInputProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const recorder = useVoiceRecorder();
  
  // We use the stream hook to handle the audio submission to the backend
  // The backend uses OpenAI Whisper (gpt-4o-mini-transcribe)
  const stream = useVoiceStream({
    onUserTranscript: (text) => {
      // This is the transcription of what the user said
      onTranscript(text);
      setIsProcessing(false);
    },
    onError: (err) => {
      console.error("Voice error:", err);
      setIsProcessing(false);
    }
  });

  const handleMicClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission if inside a form
    
    if (recorder.state === "recording") {
      setIsProcessing(true);
      const blob = await recorder.stopRecording();
      // Send to the voice chat endpoint which returns user transcript as an SSE event
      // We assume conversationId 1 exists or create a temp one for transient inputs
      try {
        await stream.streamVoiceResponse(
          `/api/conversations/${conversationId}/messages`,
          blob
        );
      } catch (e) {
        console.error("Failed to transcribe", e);
        setIsProcessing(false);
      }
    } else {
      await recorder.startRecording();
    }
  };

  const isRecording = recorder.state === "recording";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "transition-all duration-300 relative", 
        isRecording && "border-red-500 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
        className
      )}
      onClick={handleMicClick}
      disabled={isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <MicOff className="h-4 w-4" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
