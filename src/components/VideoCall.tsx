
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface VideoCallProps {
  onEndCall: () => void;
}

const VideoCall = ({ onEndCall }: VideoCallProps) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupMediaStream = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
        toast({
          title: "Camera Access Error",
          description: "Unable to access your camera and microphone. Please check your permissions.",
          variant: "destructive",
        });
      }
    };
    
    setupMediaStream();
    
    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);
  
  const toggleVideo = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isVideoOn;
      });
      setIsVideoOn(!isVideoOn);
    }
  };
  
  const toggleAudio = () => {
    const stream = localVideoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(!isAudioOn);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Video Call with Sweetheart</h2>
        <Button 
          onClick={onEndCall} 
          variant="outline" 
          size="icon" 
          className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-secondary/30 relative overflow-hidden">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            !isVideoOn && "opacity-0"
          )}
        />
        
        {!isVideoOn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <span className="text-3xl font-bold text-primary-foreground">
                You
              </span>
            </div>
          </div>
        )}
        
        {/* Remote video would go here in a real implementation */}
      </div>
      
      <div className="p-4 flex items-center justify-center space-x-4 bg-card">
        <Button
          onClick={toggleAudio}
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full w-12 h-12",
            !isAudioOn && "bg-destructive text-destructive-foreground"
          )}
        >
          {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={toggleVideo}
          variant="outline"
          size="icon"
          className={cn(
            "rounded-full w-12 h-12",
            !isVideoOn && "bg-destructive text-destructive-foreground"
          )}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>
        
        <Button
          onClick={onEndCall}
          variant="destructive"
          size="icon"
          className="rounded-full w-12 h-12"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoCall;
