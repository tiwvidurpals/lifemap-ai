
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex my-2",
        message.isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 break-words animate-fade-in",
          message.isCurrentUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none"
        )}
      >
        <p className="mb-1">{message.content}</p>
        <p className="text-xs opacity-70 text-right">
          {format(message.timestamp, "h:mm a")}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
