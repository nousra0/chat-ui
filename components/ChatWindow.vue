<template>
  <div class="chat-window d-flex flex-column flex-grow-1 overflow-hidden">
    <!-- No conversation selected -->
    <template v-if="!selectedConversation">
      <div class="chat-empty position-relative d-flex flex-grow-1 align-items-center justify-content-center p-4">
        <button
          type="button"
          class="sidebar-menu-btn"
          aria-label="Open conversations"
          @click="openSidebar"
        >
          ☰ Conversations
        </button>
        <button
          type="button"
          class="theme-btn-empty"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleDark"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
        <div class="text-center chat-empty-content">
          <div class="chat-empty-icon">💬</div>
          <p class="chat-empty-title">Select a conversation</p>
          <p class="chat-empty-sub">Choose from the sidebar to start messaging</p>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Header -->
      <header class="chat-header">
        <!-- Mobile: first row = burger + "Conversations" -->
        <div class="header-mobile-first-row">
          <button
            type="button"
            class="header-btn header-btn-icon sidebar-menu-btn"
            aria-label="Open conversations"
            @click="openSidebar"
          >
            ☰
          </button>
          <span class="header-conversations-label">Conversations</span>
        </div>
        <!-- Second row (desktop: only row) = avatar, name, actions -->
        <div class="header-main-row d-flex align-items-center justify-content-between gap-2">
          <div class="d-flex align-items-center gap-3 min-w-0 flex-grow-1">
            <div class="header-avatar-wrap">
              <img
                :src="selectedConversation.participant.avatar"
                :alt="selectedConversation.participant.name"
                class="header-avatar"
                width="40"
                height="40"
              />
              <span
                v-if="selectedConversation.participant.status === 'online'"
                class="status-dot"
              />
            </div>
            <div class="min-w-0">
              <h1 class="header-name text-truncate">{{ selectedConversation.participant.name }}</h1>
              <small class="header-status">{{ statusText }}</small>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              class="header-btn header-btn-theme"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggleDark"
            >
              {{ isDark ? '☀️ Light' : '🌙 Dark' }}
            </button>
            <span class="header-divider" aria-hidden="true" />
            <button type="button" class="header-btn header-btn-icon" aria-label="Call">📞</button>
            <button type="button" class="header-btn header-btn-icon" aria-label="Video">📹</button>
            <button type="button" class="header-btn header-btn-icon" aria-label="More">⋯</button>
          </div>
        </div>
      </header>

      <!-- Message list (scrollable) -->
      <div ref="messagesContainer" class="messages-container flex-grow-1 overflow-auto overflow-x-hidden p-3">
        <div v-for="msg in messages" :key="msg.id" class="message-row">
          <MessageBubble :message="msg" />
        </div>
        <!-- Typing indicator -->
        <div
          v-if="isOtherTyping"
          class="typing-indicator d-flex align-items-center gap-2 py-2 small min-w-0"
        >
          <span class="typing-dots">
            <span></span><span></span><span></span>
          </span>
          <span class="typing-text text-truncate">{{ selectedConversation.participant.name }} is typing...</span>
        </div>
      </div>

      <!-- Input area -->
      <div class="input-area">
        <div class="input-row d-flex align-items-stretch gap-2">
          <div class="input-wrap flex-grow-1 min-w-0 d-flex">
            <textarea
              v-model="inputText"
              class="input-field"
              rows="1"
              placeholder="Type a message..."
              aria-label="Message input"
              @keydown.enter.exact.prevent="send"
            />
          </div>
          <button
            type="button"
            class="btn-send flex-shrink-0"
            aria-label="Send message"
            :disabled="!inputText.trim()"
            @click="send"
          >
            Send
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const {
  selectedConversation,
  messages,
  isOtherTyping,
  sendMessage,
  setTyping,
} = useChat()
const { isDark, toggleDark } = useTheme()
const { openSidebar } = useSidebar()

const inputText = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const statusText = computed(() => {
  if (!selectedConversation.value) return ''
  const s = selectedConversation.value.participant.status
  if (s === 'online') return 'Online'
  if (s === 'away') return 'Away'
  return 'Offline'
})

function send() {
  const text = inputText.value.trim()
  if (!text) return
  sendMessage(text)
  inputText.value = ''
  nextTick(() => scrollToBottom())
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Scroll to bottom when messages change
watch(messages, () => nextTick(() => scrollToBottom()), { deep: true })

// Optional: mock typing indicator on interval (demo)
let typingInterval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  typingInterval = setInterval(() => {
    setTyping(Math.random() > 0.85)
  }, 4000)
})
onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval)
})
</script>

<style scoped>
.chat-window {
  min-height: 0;
  background: #fff;
  border-radius: 0;
  box-shadow: var(--chat-shadow);
  border: 1px solid rgba(73, 136, 196, 0.15);
}
[data-bs-theme="dark"] .chat-window {
  background: var(--app-navy);
  border-color: rgba(73, 136, 196, 0.3);
}

/* Empty state */
.chat-empty {
  background: linear-gradient(180deg, rgba(189, 232, 245, 0.35) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 20px;
}

.theme-btn-empty {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--app-blue);
  background: rgba(73, 136, 196, 0.12);
  border: 1px solid rgba(73, 136, 196, 0.3);
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.theme-btn-empty:hover {
  background: rgba(73, 136, 196, 0.2);
  border-color: var(--app-sky);
}

.chat-empty-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}
.chat-empty-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--app-navy);
  margin-bottom: 0.35rem;
}
.chat-empty-sub {
  font-size: 0.9rem;
  color: var(--app-sky);
}

/* Header */
.chat-header {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fff 0%, rgba(189, 232, 245, 0.25) 100%);
  border-bottom: 1px solid rgba(73, 136, 196, 0.12);
}
[data-bs-theme="dark"] .chat-header {
  background: linear-gradient(135deg, rgba(28, 77, 141, 0.4) 0%, rgba(15, 40, 84, 0.6) 100%);
  border-bottom-color: rgba(73, 136, 196, 0.25);
}

/* Mobile: first row = burger + "Conversations"; second row = avatar, name, actions */
.header-mobile-first-row {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(73, 136, 196, 0.12);
  margin-bottom: 0.75rem;
}
[data-bs-theme="dark"] .header-mobile-first-row {
  border-bottom-color: rgba(73, 136, 196, 0.25);
}
.header-conversations-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--app-navy);
}
[data-bs-theme="dark"] .header-conversations-label {
  color: #fff;
}
@media (max-width: 767.98px) {
  .chat-header {
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .header-mobile-first-row {
    display: flex;
  }
}

.header-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(73, 136, 196, 0.25);
}
.header-avatar-wrap .status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background: #4ade80;
  border-radius: 50%;
  border: 2px solid #fff;
}
.header-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--app-navy);
  margin: 0;
}
[data-bs-theme="dark"] .header-name {
  color: #fff;
}
.header-status {
  color: var(--app-sky);
  font-size: 0.8rem;
}

.header-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.header-btn-theme {
  color: var(--app-blue);
  background: rgba(73, 136, 196, 0.12);
}
.header-btn-theme:hover {
  background: rgba(73, 136, 196, 0.2);
}
.header-btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-navy);
  background: rgba(189, 232, 245, 0.5);
}
[data-bs-theme="dark"] .header-btn-icon {
  color: var(--app-ice);
  background: rgba(73, 136, 196, 0.35);
}
.header-btn-icon:hover {
  background: var(--app-ice);
  transform: scale(1.05);
}
[data-bs-theme="dark"] .header-btn-icon:hover {
  background: rgba(73, 136, 196, 0.5);
}
.header-divider {
  width: 1px;
  height: 24px;
  background: rgba(73, 136, 196, 0.25);
}

/* Sidebar menu button: visible only on small screens to open conversation list */
.sidebar-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--app-blue);
  background: rgba(73, 136, 196, 0.12);
  border: 1px solid rgba(73, 136, 196, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.sidebar-menu-btn:hover {
  background: rgba(73, 136, 196, 0.2);
  border-color: var(--app-sky);
}
[data-bs-theme="dark"] .sidebar-menu-btn {
  color: var(--app-ice);
  background: rgba(73, 136, 196, 0.25);
  border-color: rgba(73, 136, 196, 0.4);
}
[data-bs-theme="dark"] .sidebar-menu-btn:hover {
  background: rgba(73, 136, 196, 0.4);
}
@media (max-width: 767.98px) {
  .sidebar-menu-btn {
    display: inline-flex;
  }
}
.chat-empty .sidebar-menu-btn {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

@media (max-width: 575.98px) {
  .header-divider { display: none; }
  .header-btn-theme {
    padding: 0.35rem 0.5rem;
    font-size: 0.8rem;
  }
  .header-btn-icon {
    width: 32px;
    height: 32px;
  }
}

/* Messages area */
.messages-container {
  background: linear-gradient(180deg, rgba(189, 232, 245, 0.12) 0%, #fff 30%);
  min-height: 200px;
}
[data-bs-theme="dark"] .messages-container {
  background: linear-gradient(180deg, rgba(28, 77, 141, 0.2) 0%, var(--app-navy) 20%);
}

.typing-indicator {
  color: var(--app-sky);
  overflow: hidden;
}
.typing-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}
.typing-dots {
  display: inline-flex;
  gap: 4px;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  background: var(--app-sky);
  border-radius: 50%;
  animation: typing-bounce 0.6s ease-in-out infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.1s; }
.typing-dots span:nth-child(3) { animation-delay: 0.2s; }
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

/* Input */
.input-area {
  background: #fff;
  border-top: 1px solid rgba(73, 136, 196, 0.12);
  border-radius: 0 0 20px 20px;
  padding: 1rem;
}
[data-bs-theme="dark"] .input-area {
  background: var(--app-navy);
  border-top-color: rgba(73, 136, 196, 0.25);
}
.input-row {
  min-width: 0;
}
.input-wrap {
  min-height: 44px;
}
.input-field {
  width: 100%;
  min-height: 44px;
  padding: 0 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--app-navy);
  background: rgba(189, 232, 245, 0.25);
  border: 1px solid rgba(73, 136, 196, 0.2);
  border-radius: 16px;
  resize: none;
  max-height: 120px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  /* Vertically center first line in min-height */
  padding-top: calc((44px - 1em * 1.4) / 2);
  padding-bottom: calc((44px - 1em * 1.4) / 2);
  flex: 1 1 auto;
  align-self: stretch;
}
[data-bs-theme="dark"] .input-field {
  color: #fff;
  background: rgba(28, 77, 141, 0.4);
  border-color: rgba(73, 136, 196, 0.4);
}
.input-field::placeholder {
  color: var(--app-sky);
  opacity: 0.8;
}
.input-field:focus {
  outline: none;
  border-color: var(--app-sky);
  box-shadow: 0 0 0 3px rgba(73, 136, 196, 0.15);
}
.btn-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  background: linear-gradient(135deg, var(--app-blue) 0%, var(--app-sky) 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: filter 0.2s, transform 0.15s;
  white-space: nowrap;
  min-height: 44px;
  align-self: stretch;
  box-sizing: border-box;
}
.btn-send:hover:not(:disabled) {
  filter: brightness(1.08);
  transform: translateY(-1px);
}
.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Mobile: ensure input area and chat fit without overflow */
@media (max-width: 575.98px) {
  .chat-header {
    padding: 0.75rem 0.75rem;
  }
  .input-area {
    padding: 0.5rem 0.75rem;
    border-radius: 0 0 12px 12px;
  }
  .input-wrap {
    min-height: 40px;
  }
  .input-field {
    min-height: 40px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: calc((40px - 1em * 1.4) / 2);
    padding-bottom: calc((40px - 1em * 1.4) / 2);
    font-size: 0.875rem;
  }
  .btn-send {
    padding: 0 0.75rem;
    font-size: 0.85rem;
    min-height: 40px;
  }
  .messages-container {
    padding: 0.75rem !important;
  }
}
</style>
