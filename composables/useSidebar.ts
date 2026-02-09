// Shared sidebar open/close state. On small screens sidebar starts closed and can be toggled.

const isSidebarOpen = useState('sidebar-open', () => ref(false))

export function useSidebar() {
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
