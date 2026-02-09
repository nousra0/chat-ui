// Reactive chat state: selected conversation, messages, typing indicator.
// Singleton state so sidebar and chat window always show the same selection.

import type { Conversation, Message } from '~/types/chat'
import { getMockConversations } from '~/data/mockChat'

const initialConversations = getMockConversations()

const conversations = ref<Conversation[]>(initialConversations)
const selectedConversationId = ref<string | null>(initialConversations[0]?.id ?? null)
const isOtherTyping = ref(false)

const selectedConversation = computed(() => {
  if (!selectedConversationId.value) return null
  return conversations.value.find(c => c.id === selectedConversationId.value) ?? null
})

const messages = computed(() => {
  const conv = selectedConversation.value
  return conv ? conv.messages : []
})

function selectConversation(id: string) {
  selectedConversationId.value = id
  const conv = conversations.value.find(c => c.id === id)
  if (conv) conv.unreadCount = 0
}

function sendMessage(content: string) {
  const conv = selectedConversation.value
  if (!conv || !content.trim()) return

  const newMsg: Message = {
    id: `msg-${Date.now()}`,
    conversationId: conv.id,
    senderId: 'current-user',
    content: content.trim(),
    timestamp: new Date(),
    read: false,
    isSent: true,
  }
  conv.messages.push(newMsg)
  conv.lastMessage = newMsg.content
  conv.lastMessageAt = newMsg.timestamp
}

function setTyping(value: boolean) {
  isOtherTyping.value = value
}

export function useChat() {
  return {
    conversations,
    selectedConversationId,
    selectedConversation,
    messages,
    isOtherTyping,
    selectConversation,
    sendMessage,
    setTyping,
  }
}
