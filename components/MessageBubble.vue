<template>
  <div
    class="message-bubble-wrapper d-flex mb-3"
    :class="isSent ? 'justify-content-end' : 'justify-content-start'"
  >
    <div
      class="message-bubble position-relative"
      :class="[
        isSent
          ? 'sent-bubble align-self-end'
          : 'received-bubble align-self-start',
      ]"
    >
      <p class="bubble-text">{{ message.content }}</p>
      <div class="bubble-meta d-flex align-items-center justify-content-end gap-1">
        <span class="time">{{ formattedTime }}</span>
        <span v-if="isSent && message.read" class="read-indicator" title="Read">✓✓</span>
        <span v-else-if="isSent" class="read-indicator" title="Sent">✓</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/chat'

const props = defineProps<{
  message: Message
}>()

const { formatTimeWithDate } = useFormatTime()
const isSent = computed(() => props.message.isSent)
const formattedTime = computed(() => formatTimeWithDate(props.message.timestamp))
</script>

<style scoped>
.message-bubble-wrapper {
  min-width: 0;
  overflow: hidden;
}
.message-bubble {
  max-width: 75%;
  min-width: 4rem;
  padding: 0.65rem 1rem;
  border-radius: 18px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  box-sizing: border-box;
}
@media (max-width: 575.98px) {
  .message-bubble {
    max-width: 88%;
    padding: 0.5rem 0.75rem;
  }
  .bubble-text {
    font-size: 0.9rem;
  }
}
.message-bubble:hover {
  transform: translateY(-2px);
  box-shadow: var(--chat-shadow-hover);
}
.sent-bubble {
  background: linear-gradient(135deg, var(--app-blue) 0%, var(--app-sky) 100%);
  color: #fff;
  border-bottom-right-radius: 6px !important;
  box-shadow: 0 4px 14px rgba(28, 77, 141, 0.35);
}
.received-bubble {
  background: var(--app-ice);
  color: var(--app-navy);
  border: 1px solid rgba(73, 136, 196, 0.25);
  border-bottom-left-radius: 6px !important;
  box-shadow: 0 2px 10px rgba(15, 40, 84, 0.08);
}
.bubble-text {
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
  line-height: 1.4;
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}
.bubble-meta {
  font-size: 0.7rem;
  opacity: 0.9;
}
.read-indicator {
  font-size: 0.7rem;
}
</style>
