
import { useState } from "react";
import { Card } from "@/components/ui/card";
import AuthForm from "@/components/AuthForm";
import ChatInterface from "@/components/ChatInterface";
import VideoCall from "@/components/VideoCall";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isInVideoCall, setIsInVideoCall] = useState(false);
  const { toast } = useToast();

  const handleLogin = (username: string, password: string) => {
    // In a real app, you'd validate against a secure backend
    // For this demo, we'll simulate successful login
    if (username && password) {
      setUsername(username);
      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in to Secret Sweetheart",
      });
    }
  };

  const handleStartVideoCall = () => {
    setIsInVideoCall(true);
  };

  const handleEndVideoCall = () => {
    setIsInVideoCall(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-4xl h-[600px] shadow-xl overflow-hidden">
        {!isLoggedIn ? (
          <AuthForm onLogin={handleLogin} />
        ) : isInVideoCall ? (
          <VideoCall onEndCall={handleEndVideoCall} />
        ) : (
          <ChatInterface 
            username={username}
            onStartVideoCall={handleStartVideoCall} 
          />
        )}
      </Card>
    </div>
  );
};

export default Index;
