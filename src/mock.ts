// Mock data for Discord-like chat application

export const mockServers = [
  {
    id: '1',
    name: 'My Server',
    icon: '🏠',
    isActive: true
  },
  {
    id: '2', 
    name: 'Gaming Hub',
    icon: '🎮',
    isActive: false
  },
  {
    id: '3',
    name: 'Study Group',
    icon: '📚',
    isActive: false
  },
  {
    id: '4',
    name: 'Work Team',
    icon: '💼',
    isActive: false
  }
];

export const mockChannels = [
  {
    id: '1',
    name: 'general',
    type: 'text',
    isActive: true,
    hasUnread: false
  },
  {
    id: '2',
    name: 'random',
    type: 'text', 
    isActive: false,
    hasUnread: true
  },
  {
    id: '3',
    name: 'Gaming',
    type: 'voice',
    isActive: false,
    hasUnread: false,
    userCount: 3
  },
  {
    id: '4',
    name: 'music',
    type: 'text',
    isActive: false,
    hasUnread: false
  }
];

export const mockDirectMessages = [
  {
    id: '1',
    username: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b566?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    hasUnread: true,
    lastMessage: 'Hey, are you free today?'
  },
  {
    id: '2', 
    username: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    isOnline: false,
    hasUnread: false,
    lastMessage: 'Thanks for the help!'
  },
  {
    id: '3',
    username: 'Carol Williams',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    isOnline: true,
    hasUnread: false,
    lastMessage: 'See you tomorrow'
  }
];

export const mockMessages = [
  {
    id: '1',
    userId: '1',
    username: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b566?w=100&h=100&fit=crop&crop=face',
    content: 'Hey everyone! How\'s your day going?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    reactions: [
      { emoji: '👋', count: 2, userReacted: false },
      { emoji: '😊', count: 1, userReacted: true }
    ]
  },
  {
    id: '2',
    userId: '2', 
    username: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'Pretty good! Just finished working on that new feature we discussed. What do you think about this approach?',
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    reactions: []
  },
  {
    id: '3',
    userId: '3',
    username: 'Carol Williams', 
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    content: 'Looks great! I love the clean design approach you\'ve taken.',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    reactions: [
      { emoji: '❤️', count: 3, userReacted: true }
    ]
  },
  {
    id: '4',
    userId: '1',
    username: 'Alice Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b566?w=100&h=100&fit=crop&crop=face',
    content: 'Thanks! I spent quite a bit of time on the user experience. Want to hop on a call later to discuss the next steps?',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    reactions: []
  },
  {
    id: '5',
    userId: '4',
    username: 'David Brown',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    content: 'Count me in! I have some ideas for the backend integration as well.',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    reactions: [
      { emoji: '🚀', count: 2, userReacted: false }
    ]
  },
  {
    id: '6',
    userId: '2',
    username: 'Bob Smith',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    content: 'Perfect! Let\'s schedule something for 3 PM. I\'ll send over the meeting link shortly.',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    reactions: []
  }
];

export const mockCurrentUser = {
  id: 'current-user',
  username: 'You',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
  isOnline: true,
  status: 'online'
};