import { useState, type MouseEvent } from 'react'
import { prefersReducedMotion, withViewTransition } from './viewTransition'

type Theme = 'light' | 'dark'

// index.html setter data-theme før React starter
const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    const transition = withViewTransition(() => {
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {}
      setTheme(next)
    }, ['theme'])

    if (!transition || prefersReducedMotion()) return

    // Tastaturklikk har ingen museposisjon, bruk midten av knappen
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.detail > 0 ? e.clientX : rect.left + rect.width / 2
    const y = e.detail > 0 ? e.clientY : rect.top + rect.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 550, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
        )
      })
      .catch(() => {})
  }

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label="Bytt tema">
      {theme === 'dark' ? 'lys' : 'mørk'}
    </button>
  )
}
