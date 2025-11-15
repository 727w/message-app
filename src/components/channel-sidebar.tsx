import { useState, type FC } from "react";
import {
  Hash,
  Volume2,
  Settings,
  Mic,
  Headphones,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

interface ChannelSidebarProps {
  channels: Array<{
    id: string;
    name: string;
    type: "text" | "voice";
    isActive: boolean;
    hasUnread: boolean;
    userCount?: number;
  }>;
  directMessages: Array<{
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
    lastMessage: string;
    hasUnread: boolean;
  }>;
  currentUser: {
    id: string;
    username: string;
    avatar: string;
    status: "online" | "idle" | "dnd" | "offline";
  };
  onChannelSelect: (channelId: string) => void;
  onDMSelect: (dmId: string) => void;
}

const ChannelSidebar: FC<ChannelSidebarProps> = ({
  channels,
  directMessages,
  currentUser,
  onChannelSelect,
  onDMSelect,
}) => {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmExpanded, setDmExpanded] = useState(true);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-full">
      <ResizablePanel
        defaultSize={20}
        className="bg-foreground border-l-1 border-gray-700 flex flex-col"
      >
        {/* Server Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">My Server</h2>
        </div>
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Text Channels Section */}
          <div className="px-2 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1 h-8 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => setChannelsExpanded(!channelsExpanded)}
            >
              {channelsExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wide">
                Text Channels
              </span>
            </Button>
            {channelsExpanded && (
              <div className="mt-1 space-y-0.5">
                {channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={`w-full justify-start px-2 py-1.5 h-8 text-sm ${
                      channel.isActive
                        ? "bg-zinc-700 text-white"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                    }`}
                    onClick={() => onChannelSelect(channel.id)}
                  >
                    {channel.type === "text" ? (
                      <Hash className="w-4 h-4 mr-2" />
                    ) : (
                      <Volume2 className="w-4 h-4 mr-2" />
                    )}
                    <span className="truncate">{channel.name}</span>
                    {channel.hasUnread && (
                      <Badge className="ml-auto w-2 h-2 p-0 bg-red-500" />
                    )}
                    {channel.type === "voice" && channel.userCount && (
                      <span className="ml-auto text-xs text-gray-500">
                        {channel.userCount}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
          <Separator className="mx-2 bg-gray-700" />
          {/* Direct Messages Section */}
          <div className="px-2 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start px-2 py-1 h-8 text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              onClick={() => setDmExpanded(!dmExpanded)}
            >
              {dmExpanded ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              <span className="text-xs font-semibold uppercase tracking-wide">
                Direct Messages
              </span>
            </Button>
            {dmExpanded && (
              <div className="mt-1 space-y-0.5">
                {directMessages.map((dm) => (
                  <Button
                    key={dm.id}
                    variant="ghost"
                    className="w-full justify-start px-2 py-1.5 h-10 text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                    onClick={() => onDMSelect(dm.id)}
                  >
                    <div className="relative mr-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={dm.avatar} alt={dm.username} />
                        <AvatarFallback className="text-xs">
                          {dm.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {dm.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-800 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{dm.username}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {dm.lastMessage}
                      </div>
                    </div>
                    {dm.hasUnread && (
                      <Badge className="ml-auto w-2 h-2 p-0 bg-red-500" />
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* User Panel */}
        <div className="px-2 py-2 border-t border-gray-700">
          <div className="flex items-center justify-between bg-accent-foreground rounded p-2">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.username}
                  />
                  <AvatarFallback className="text-sm">
                    {currentUser.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-700 rounded-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">
                  {currentUser.username}
                </div>
                <div className="text-xs text-gray-400 capitalize">
                  {currentUser.status}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                <Mic className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                <Headphones className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
};

export default ChannelSidebar;
