import { type FC, useEffect, useState } from "react";
import ServerSidebar from "../components/server-sidebar";
import ChannelSidebar from "../components/channel-sidebar";
import ChatArea from "../components/chat-area";
import { Button } from "../components/ui/button";
import { LogOut } from "lucide-react";
import {
  mockServers,
  mockChannels,
  mockDirectMessages,
  mockMessages,
  mockCurrentUser,
} from "../mock";
import { useAuth } from "../contexts/auth-context";
import type { Message } from "../types/types";
import { io } from "socket.io-client";

const Home: FC = () => {
  const { user, logout } = useAuth();

  // Gunakan tipe Message[] untuk state messages
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const [, setSelectedServer] = useState<string>("1");
  const [selectedChannel, setSelectedChannel] = useState<string>("1");
  const [selectedDM, setSelectedDM] = useState<string | null>(null);

  const socket = io("http://localhost:3000");

  const handleServerSelect = (serverId: string): void => {
    setSelectedServer(serverId);
    setSelectedDM(null);
  };

  const handleChannelSelect = (channelId: string): void => {
    setSelectedChannel(channelId);
    setSelectedDM(null);
  };

  const handleDMSelect = (dmId: string): void => {
    setSelectedDM(dmId);
    setSelectedChannel("");
  };

  const handleSendMessage = (content: string): void => {
    if (!user) return; // jika user belum siap

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content,
      timestamp: new Date(),
      reactions: [],
    };
    setMessages((prev) => [...prev, newMessage]);
    socket.emit("message", newMessage);
  };

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          // pastikan timestamp jadi Date object
          timestamp: new Date(msg.timestamp ?? Date.now()),
        },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const handleAddReaction = (messageId: string, emoji: string): void => {
    setMessages((prev) =>
      prev.map((message) => {
        if (message.id === messageId) {
          const existingReaction = message.reactions.find(
            (r) => r.emoji === emoji
          );
          if (existingReaction) {
            return {
              ...message,
              reactions: message.reactions
                .map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.userReacted ? r.count - 1 : r.count + 1,
                        userReacted: !r.userReacted,
                      }
                    : r
                )
                .filter((r) => r.count > 0),
            };
          } else {
            return {
              ...message,
              reactions: [
                ...message.reactions,
                { emoji, count: 1, userReacted: true },
              ],
            };
          }
        }
        return message;
      })
    );
  };

  const getCurrentChannelName = (): string => {
    if (selectedDM) {
      const dm = mockDirectMessages.find((dm) => dm.id === selectedDM);
      return dm ? dm.username : "Unknown";
    }
    const channel = mockChannels.find((c) => c.id === selectedChannel);
    return channel ? channel.name : "general";
  };

  const allowedStatuses = ["online", "offline", "idle", "dnd"] as const;

  const currentUser = {
    ...mockCurrentUser,
    ...user,
    status: allowedStatuses.includes(user?.status as any)
      ? (user?.status as "online" | "offline" | "idle" | "dnd")
      : "offline", // default fallback
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white relative">
      <Button
        onClick={logout}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-50 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>

      <ServerSidebar
        servers={mockServers}
        onServerSelect={handleServerSelect}
      />

      <ChannelSidebar
        channels={mockChannels.map((c) => ({
          id: c.id,
          name: c.name,
          type: (c.type ?? "text") as "text" | "voice",
          isActive: c.isActive ?? false,
          hasUnread: c.hasUnread ?? false,
          userCount: c.userCount ?? 0,
        }))}
        directMessages={mockDirectMessages}
        currentUser={currentUser}
        onChannelSelect={handleChannelSelect}
        onDMSelect={handleDMSelect}
      />

      <ChatArea
        messages={messages}
        currentUser={currentUser}
        channelName={getCurrentChannelName()}
        onSendMessage={handleSendMessage}
        onAddReaction={handleAddReaction}
      />
    </div>
  );
};

export default Home;
