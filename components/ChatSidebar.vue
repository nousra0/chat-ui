<template>
  <aside
    class="chat-sidebar d-flex flex-column overflow-hidden"
    :class="{ 'sidebar-open': isSidebarOpen }"
  >
    <!-- Logo / title -->
    <div class="sidebar-header d-flex align-items-center justify-content-between gap-2">
      <div class="d-flex align-items-center gap-3">
        <div class="app-logo">
          <span class="app-logo-text">C</span>
        </div>
        <div>
          <span class="sidebar-title">Messages</span>
          <span class="sidebar-subtitle d-block">Your conversations</span>
        </div>
      </div>
      <button
        type="button"
        class="sidebar-close-btn"
        aria-label="Close sidebar"
        @click="closeSidebar"
      >
        ✕
      </button>
    </div>

    <!-- Search -->
    <div class="sidebar-search-wrap">
      <div class="sidebar-search">
        <span class="sidebar-search-icon" aria-hidden="true">⌕</span>
        <input
          v-model="searchQuery"
          type="text"
          class="sidebar-search-input"
          placeholder="Search conversations..."
          aria-label="Search"
        />
      </div>
    </div>

    <!-- Conversation list -->
    <div class="conversation-list flex-grow-1 overflow-auto overflow-x-hidden">
      <div
        v-for="conv in filteredConversations"
        :key="conv.id"
        role="button"
        class="conversation-item d-flex align-items-center gap-3 text-start"
        :class="{ 'active': conv.id === selectedConversationId }"
        @click="onSelect(conv.id)"
      >
        <div class="conv-avatar-wrap">
          <img
            :src="conv.participant.avatar"
            :alt="conv.participant.name"
            class="conv-avatar"
            width="48"
            height="48"
          />
          <span
            v-if="conv.participant.status === 'online'"
            class="status-dot"
          />
        </div>
        <div class="conv-text flex-grow-1 min-w-0">
          <div class="d-flex justify-content-between align-items-center gap-2 mb-0 conv-row">
            <span class="conv-name">{{ conv.participant.name }}</span>
            <span class="conv-time flex-shrink-0">{{ formatTimeShort(conv.lastMessageAt) }}</span>
          </div>
          <p class="conv-preview">{{ conv.lastMessage || 'No messages yet' }}</p>
        </div>
        <span
          v-if="conv.unreadCount > 0"
          class="unread-badge"
        >
          {{ conv.unreadCount > 99 ? '99+' : conv.unreadCount }}
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { conversations, selectedConversationId, selectConversation } = useChat()
const { isSidebarOpen, closeSidebar } = useSidebar()
const { formatTimeShort } = useFormatTime()
const searchQuery = ref('')

// Filter conversations by search (name or last message)
const filteredConversations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return conversations.value
  return conversations.value.filter(
    c =>
      c.participant.name.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
  )
})

function onSelect(id: string) {
  selectConversation(id)
  emit('select', id)
  // On mobile, close sidebar so the chat window is visible
  closeSidebar()
}

const emit = defineEmits<{ select: [id: string] }>()

defineExpose({ isSidebarOpen, closeSidebar })
</script>

<style scoped>
.chat-sidebar {
  width: 340px;
  min-width: 280px;
  max-width: 100%;
  background: linear-gradient(180deg, var(--app-navy) 0%, #0d2044 100%);
  border-radius: 0;
  box-shadow: var(--chat-shadow);
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(189, 232, 245, 0.12);
}

.sidebar-close-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  font-size: 1.1rem;
  color: var(--app-ice);
  background: rgba(189, 232, 245, 0.15);
  border: 1px solid rgba(189, 232, 245, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.sidebar-close-btn:hover {
  background: rgba(189, 232, 245, 0.25);
  color: #fff;
}
@media (max-width: 767.98px) {
  .sidebar-close-btn {
    display: inline-flex;
  }
}

.app-logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(145deg, var(--app-sky) 0%, var(--app-blue) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(73, 136, 196, 0.4);
}

.app-logo-text {
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.sidebar-title {
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  letter-spacing: -0.01em;
}

.sidebar-subtitle {
  font-size: 0.75rem;
  color: var(--app-ice);
  opacity: 0.85;
}

.sidebar-search-wrap {
  padding: 0.75rem 1rem;
}

.sidebar-search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(189, 232, 245, 0.12);
  border: 1px solid rgba(189, 232, 245, 0.2);
  border-radius: 14px;
  padding: 0.5rem 1rem;
  transition: background 0.2s, border-color 0.2s;
}

.sidebar-search:focus-within {
  background: rgba(189, 232, 245, 0.18);
  border-color: var(--app-sky);
  box-shadow: 0 0 0 3px rgba(73, 136, 196, 0.2);
}

.sidebar-search-icon {
  color: var(--app-ice);
  opacity: 0.9;
  font-size: 1rem;
}

.sidebar-search-input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.9rem;
}

.sidebar-search-input::placeholder {
  color: var(--app-ice);
  opacity: 0.7;
}

.conversation-item {
  cursor: pointer;
  padding: 1rem 1.25rem;
  margin: 0 0.5rem 0.25rem;
  border-radius: 14px;
  transition: background 0.2s ease, transform 0.15s ease;
}

.conversation-item:hover {
  background: rgba(73, 136, 196, 0.2);
}

.conversation-item.active {
  background: linear-gradient(135deg, rgba(73, 136, 196, 0.35) 0%, rgba(28, 77, 141, 0.25) 100%);
  box-shadow: inset 0 0 0 1px rgba(189, 232, 245, 0.25);
}

.conv-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.conv-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(189, 232, 245, 0.3);
}

.conversation-item.active .conv-avatar {
  border-color: var(--app-sky);
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #4ade80;
  border-radius: 50%;
  border: 2px solid var(--app-navy);
}

.conv-text {
  overflow: hidden;
}

.conv-row {
  min-width: 0;
}

.conv-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.conv-time {
  font-size: 0.75rem;
  color: var(--app-ice);
  opacity: 0.85;
  flex-shrink: 0;
}

.conv-preview {
  font-size: 0.8rem;
  color: var(--app-ice);
  opacity: 0.9;
  margin: 0.15rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.unread-badge {
  flex-shrink: 0;
  min-width: 1.25rem;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--app-navy);
  background: var(--app-ice);
  border-radius: 10px;
}

@media (max-width: 767.98px) {
  .chat-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1050;
    border-radius: 0;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }
  .chat-sidebar.sidebar-open {
    transform: translateX(0);
  }
}
</style>
