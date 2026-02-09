// Shared theme state (dark/light). Singleton so layout and all components see the same state.

const isDark = ref(false)

function applyTheme(dark: boolean) {
  if (import.meta.client) {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light')
  }
}

function toggleDark() {
  isDark.value = !isDark.value
  applyTheme(isDark.value)
}

function initTheme() {
  if (import.meta.client && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
    applyTheme(true)
  }
}

export function useTheme() {
  return { isDark, toggleDark, initTheme }
}
