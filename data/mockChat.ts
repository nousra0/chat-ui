// Mock data for conversations and messages. No API calls; used for UI showcase.

import type { Conversation, Message, User } from '~/types/chat'

// Current user (you) – used only in this file for mock senderId
const currentUserId = 'current-user'

// Sample users for conversations
const users: User[] = [
  { id: '1', name: 'Alex Morgan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'online' },
  { id: '2', name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', status: 'away' },
  { id: '3', name: 'Sam Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam', status: 'offline' },
  { id: '4', name: 'Riley Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley', status: 'online' },
  { id: '5', name: 'Casey Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey', status: 'offline' },
]

function makeMessages(conversationId: string, participantId: string): Message[] {
  const baseTime = new Date()
  baseTime.setHours(baseTime.getHours() - 2)

  return [
    {
      id: 'm1',
      conversationId,
      senderId: participantId,
      content: 'Hey! Are you free for a quick call this afternoon?',
      timestamp: new Date(baseTime.getTime() + 0),
      read: true,
      isSent: false,
    },
    {
      id: 'm2',
      conversationId,
      senderId: currentUserId,
      content: 'Sure, I have a slot around 3 PM. Does that work?',
      timestamp: new Date(baseTime.getTime() + 5 * 60 * 1000),
      read: true,
      isSent: true,
    },
    {
      id: 'm3',
      conversationId,
      senderId: participantId,
      content: 'Perfect, 3 PM works. I\'ll send the meeting link.',
      timestamp: new Date(baseTime.getTime() + 8 * 60 * 1000),
      read: true,
      isSent: false,
    },
    {
      id: 'm4',
      conversationId,
      senderId: currentUserId,
      content: 'Sounds good, talk then!',
      timestamp: new Date(baseTime.getTime() + 10 * 60 * 1000),
      read: true,
      isSent: true,
    },
  ]
}

function makeMessages2(conversationId: string, participantId: string): Message[] {
  const baseTime = new Date()
  baseTime.setHours(baseTime.getHours() - 1)

  return [
    {
      id: 'm5',
      conversationId,
      senderId: currentUserId,
      content: 'Did you get a chance to review the design mockups?',
      timestamp: new Date(baseTime.getTime() + 0),
      read: true,
      isSent: true,
    },
    {
      id: 'm6',
      conversationId,
      senderId: participantId,
      content: 'Yes, they look great! I have a few small notes.',
      timestamp: new Date(baseTime.getTime() + 3 * 60 * 1000),
      read: true,
      isSent: false,
    },
    {
      id: 'm7',
      conversationId,
      senderId: currentUserId,
      content: 'Send them over when you can.',
      timestamp: new Date(baseTime.getTime() + 5 * 60 * 1000),
      read: false,
      isSent: true,
    },
  ]
}

function makeMessages3(conversationId: string, participantId: string): Message[] {
  const baseTime = new Date()
  baseTime.setMinutes(baseTime.getMinutes() - 30)

  return [
    {
      id: 'm8',
      conversationId,
      senderId: participantId,
      content: 'Thanks for the update on the project timeline.',
      timestamp: new Date(baseTime.getTime() + 0),
      read: true,
      isSent: false,
    },
    {
      id: 'm9',
      conversationId,
      senderId: currentUserId,
      content: 'No problem. Let me know if you need anything else.',
      timestamp: new Date(baseTime.getTime() + 2 * 60 * 1000),
      read: true,
      isSent: true,
    },
  ]
}

// Build initial conversations with embedded messages
export function getMockConversations(): Conversation[] {
  const conv1: Conversation = {
    id: 'c1',
    participant: users[0],
    lastMessage: 'Sounds good, talk then!',
    lastMessageAt: new Date(Date.now() - 50 * 60 * 1000),
    unreadCount: 0,
    messages: makeMessages('c1', users[0].id),
  }
  const conv2: Conversation = {
    id: 'c2',
    participant: users[1],
    lastMessage: 'Send them over when you can.',
    lastMessageAt: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 2,
    messages: makeMessages2('c2', users[1].id),
  }
  const conv3: Conversation = {
    id: 'c3',
    participant: users[2],
    lastMessage: 'No problem. Let me know if you need anything else.',
    lastMessageAt: new Date(Date.now() - 28 * 60 * 1000),
    unreadCount: 0,
    messages: makeMessages3('c3', users[2].id),
  }
  const conv4: Conversation = {
    id: 'c4',
    participant: users[3],
    lastMessage: 'Sure, I\'ll join the standup.',
    lastMessageAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [],
  }
  const conv5: Conversation = {
    id: 'c5',
    participant: users[4],
    lastMessage: 'See you tomorrow!',
    lastMessageAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    unreadCount: 0,
    messages: [],
  }

  return [conv1, conv2, conv3, conv4, conv5]
}
