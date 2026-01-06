import { ref, watch } from 'vue'

const isDark = ref(false)

// Initialize theme from localStorage or system preference
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark', isDark.value)
}

// Initialize on module load
initTheme()

// Watch for system theme changes
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      // Only update if user hasn't manually set a theme
      isDark.value = e.matches
      document.documentElement.classList.toggle('dark', isDark.value)
    }
  })
}

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', theme)
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}