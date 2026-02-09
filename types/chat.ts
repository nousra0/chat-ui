// Shared types for the chat UI (conversations, messages, users).

export interface User {
  id: string
  name: string
  avatar: string
  status?: 'online' | 'away' | 'offline'
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: Date
  read: boolean
  isSent: boolean // true = current user sent it
}

export interface Conversation {
  id: string
  participant: User
  lastMessage: string
  lastMessageAt: Date
  unreadCount: number
  messages: Message[]
}
