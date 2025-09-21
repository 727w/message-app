import React, {
  useState,
  useRef,
  useEffect,
  type FC,
  type FormEvent,
  type ChangeEvent,
} from "react";
import {
  Hash,
  UserPlus,
  Pin,
  Bell,
  Search,
  Inbox,
  HelpCircle,
  Smile,
  Plus,
  Gift,
  Sticker,
  Mic,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Separator } from "./ui/separator";

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
}

interface CurrentUser {
  id: string;
  username: string;
  avatar: string;
}

interface ChatAreaProps {
  messages: Message[];
  currentUser: CurrentUser;
  channelName: string;
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const ChatArea: FC<ChatAreaProps> = ({
  messages,
  currentUser,
  channelName,
  onSendMessage,
  onAddReaction,
}) => {
  const [newMessage, setNewMessage] = useState<string>("");

  // ref untuk auto-scroll ke bawah
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (): void => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) return "Today";

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString();
  };

  const shouldShowDateSeparator = (
    currentMessage: Message,
    previousMessage?: Message
  ): boolean => {
    if (!previousMessage) return true;
    const currentDate = currentMessage.timestamp.toDateString();
    const previousDate = previousMessage.timestamp.toDateString();
    return currentDate !== previousDate;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-700">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-600 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Hash className="w-6 h-6 text-gray-400" />
          <h1 className="text-white font-semibold text-xl">{channelName}</h1>
          <Separator orientation="vertical" className="h-6 bg-gray-600" />
          <p className="text-gray-400 text-sm">
            Welcome to #{channelName}! This is the beginning of your
            conversation.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {[Bell, Pin, UserPlus, Search, Inbox, HelpCircle].map((Icon, i) => (
            <Button
              key={i}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-600"
            >
              <Icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : undefined;
          const showDateSeparator = shouldShowDateSeparator(
            message,
            previousMessage
          );

          return (
            <div key={message.id}>
              {showDateSeparator && (
                <div className="flex items-center justify-center my-6">
                  <div className="flex-1 h-px bg-gray-600" />
                  <div className="px-4 text-xs text-gray-400 font-semibold">
                    {formatDate(message.timestamp)}
                  </div>
                  <div className="flex-1 h-px bg-gray-600" />
                </div>
              )}

              <div className="flex items-start space-x-3 hover:bg-gray-600/30 px-2 py-1 rounded group">
                <Avatar className="w-10 h-10 mt-0.5">
                  <AvatarImage src={message.avatar} alt={message.username} />
                  <AvatarFallback>
                    {message.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-white font-semibold">
                      {message.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>

                  <div className="text-gray-100 text-sm leading-relaxed break-words">
                    {message.content}
                  </div>

                  {message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          className={`h-6 px-2 text-xs rounded-full ${
                            reaction.userReacted
                              ? "bg-indigo-600/20 border border-indigo-500 text-indigo-400"
                              : "bg-gray-600/50 border border-gray-500 text-gray-300 hover:bg-gray-600"
                          }`}
                          onClick={() =>
                            onAddReaction(message.id, reaction.emoji)
                          }
                        >
                          <span className="mr-1">{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </Button>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full bg-gray-600/50 border border-gray-500 text-gray-400 hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onAddReaction(message.id, "👍")}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-6">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center bg-gray-600 rounded-lg px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-500 w-6 h-6 p-0 mr-3"
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewMessage(e.target.value)
              }
              placeholder={`Message #${channelName}`}
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:border-none"
            />

            <div className="flex items-center space-x-2 ml-3">
              {[Gift, Sticker, Smile].map((Icon, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-500 w-6 h-6 p-0"
                >
                  <Icon className="w-5 h-5" />
                </Button>
              ))}
              {newMessage.length === 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-gray-500 w-6 h-6 p-0"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-2 text-xs text-gray-500 px-2">
          Use Shift+Enter for a new line • Press Enter to send
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
