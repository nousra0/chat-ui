<template>
  <div class="chat-app-layout d-flex flex-column vh-100 bg-body-secondary overflow-x-hidden">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Default layout: full-height container; theme is initialized here, toggle lives in chat header/sidebar.
const { initTheme } = useTheme()
onMounted(() => initTheme())
</script>

<style scoped>
.chat-app-layout {
  background: linear-gradient(160deg, var(--app-ice) 0%, rgba(189, 232, 245, 0.4) 40%, rgba(73, 136, 196, 0.12) 100%) !important;
  position: relative;
}
[data-bs-theme="dark"] .chat-app-layout {
  background: linear-gradient(160deg, var(--app-navy) 0%, var(--app-blue) 50%, rgba(15, 40, 84, 0.95) 100%) !important;
}
</style>
