// Shared sidebar open/close state. On small screens sidebar starts closed and can be toggled.
// useState must be called inside the composable so it runs in Nuxt context (fixes Vercel serverless).

export function useSidebar() {
  const isSidebarOpen = useState('sidebar-open', () => ref(false))

  onMounted(() => {
    if (import.meta.client && window.matchMedia('(min-width: 768px)').matches) {
      isSidebarOpen.value = true
    }
  })

  return {
    isSidebarOpen,
    openSidebar: () => { isSidebarOpen.value = true },
    closeSidebar: () => { isSidebarOpen.value = false },
  }
}
