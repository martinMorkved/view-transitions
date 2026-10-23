import { flushSync } from 'react-dom'

export const supportsViewTransitions =
  typeof document !== 'undefined' && 'startViewTransition' in document

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches


export function withViewTransition(update: () => void, types: string[] = []) {
  if (!supportsViewTransitions) {
    update()
    return null
  }

  const run = () => flushSync(update)

  try {
    return document.startViewTransition({ update: run, types })
  } catch {

    return document.startViewTransition(run)
  }
}
