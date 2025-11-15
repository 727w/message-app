import React, { type FC } from "react";
import { Home, Plus } from "lucide-react";
import { Button } from "./ui/button";

interface Server {
  id: string;
  name: string;
  icon: React.ReactNode;
  isActive: boolean;
}

interface ServerSidebarProps {
  servers: Server[];
  onServerSelect: (serverId: string) => void;
}

const ServerSidebar: FC<ServerSidebarProps> = ({ servers, onServerSelect }) => {
  return (
    <div className="w-18 bg-foreground flex flex-col items-center py-3 space-y-2">
      {/* Home Server */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 bg-cyan-800 hover:bg-indigo-500 text-white rounded-2xl hover:rounded-xl transition-all duration-200"
        onClick={() => onServerSelect("home")}
      >
        <Home className="w-6 h-6" />
      </Button>

      {/* Separator */}
      <div className="w-8 h-0.5 bg-gray-700 rounded-full my-2" />

      {/* Server List */}
      {servers.map((server) => (
        <Button
          key={server.id}
          variant="ghost"
          size="icon"
          className={`w-12 h-12 text-white font-semibold text-lg transition-all duration-200 ${
            server.isActive
              ? "bg-cyan-800 rounded-xl"
              : "bg-gray-700 hover:bg-cyan-800 rounded-2xl hover:rounded-xl"
          }`}
          onClick={() => onServerSelect(server.id)}
        >
          {server.icon}
        </Button>
      ))}

      {/* Add Server Button */}
      <Button
        variant="ghost"
        size="icon"
        className="w-12 h-12 bg-gray-700 hover:bg-green-600 text-green-400 hover:text-white rounded-2xl hover:rounded-xl transition-all duration-200"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default ServerSidebar;
