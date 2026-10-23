import { flushSync } from 'react-dom'

export const supportsViewTransitions =
  typeof document !== 'undefined' && 'startViewTransition' in document

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Kjører en React-tilstandsendring inne i en view transition.
 *
 * Nettleseren tar et bilde av gammel tilstand, kaller `update`, og forventer at
 * DOM-en er oppdatert når callbacken returnerer. React oppdaterer DOM-en
 * asynkront, derfor må endringen pakkes i `flushSync`.
 */
export function withViewTransition(update: () => void, types: string[] = []) {
  if (!supportsViewTransitions) {
    update()
    return null
  }

  const run = () => flushSync(update)

  try {
    return document.startViewTransition({ update: run, types })
  } catch {
    // Eldre Chromium (< 125) godtar bare en callback, ikke et options-objekt
    return document.startViewTransition(run)
  }
}
