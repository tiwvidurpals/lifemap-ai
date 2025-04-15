
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Video } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  username: string;
  onStartVideoCall: () => void;
}

const ChatInterface = ({ username, onStartVideoCall }: ChatInterfaceProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Welcome to Secret Sweetheart! Your messages are private and secure.",
      timestamp: new Date(),
      isCurrentUser: false,
    },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: username,
      content: message,
      timestamp: new Date(),
      isCurrentUser: true,
    };
    
    setMessages([...messages, newMessage]);
    setMessage("");
    
    // Simulate a reply after a short delay
    if (messages.length < 2) {
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "Sweetheart",
          content: "Hi love! I'm so happy we can chat securely here! ❤️",
          timestamp: new Date(),
          isCurrentUser: false,
        };
        setMessages(prev => [...prev, replyMessage]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">Chat with Sweetheart</h2>
        <Button 
          onClick={onStartVideoCall} 
          variant="outline" 
          className="bg-accent text-accent-foreground hover:bg-accent/80"
        >
          <Video className="w-4 h-4 mr-2" />
          Video Call
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t flex items-center gap-2"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          size="icon" 
          className={cn("transition-colors", !message.trim() && "opacity-50")}
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
