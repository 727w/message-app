export interface Server {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export interface Channel {
  id: string;
  name: string;
  type: 'text' | 'voice';
  isActive: boolean;
  hasUnread: boolean;
  userCount?: number;
}

export interface DirectMessage {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  hasUnread: boolean;
  lastMessage: string;
}

export interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

export interface Message {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  status: 'online' | 'away' | 'busy' | 'offline';
}