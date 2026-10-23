import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { prefersReducedMotion, withViewTransition } from '../viewTransition'
import { layout, type Layout, type Point, type Positions } from './layout'
import { ROOT, links, topics } from './topics'
import './MindMap.css'

const ids = topics.map((t) => t.id)

// Må matche ::view-transition-group i MindMap.css
const DURATION = 700
const EASING = 'cubic-bezier(0.3, 1.2, 0.4, 1)'
const STEPS = 24

type State = { focus: string; size: { width: number; height: number }; layout: Layout }

const edgeName = (a: string, b: string) => `edge-${a}-${b}`

function edgeStyle(p: Point, q: Point, angle = Math.atan2(q.y - p.y, q.x - p.x)) {
  return {
    width: `${Math.hypot(q.x - p.x, q.y - p.y)}px`,
    transform: `translate(${p.x}px, ${p.y}px) rotate(${angle}rad) translateY(-50%)`,
  }
}

function nodeCenters(board: HTMLElement) {
  const centers: Positions = {}
  for (const el of board.querySelectorAll<HTMLElement>('[data-node]')) {
    const r = el.getBoundingClientRect()
    centers[el.dataset.node!] = { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  return centers
}

const lerp = (a: Point, b: Point, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

// Nettleseren ville bare interpolert linjens rotasjon og bredde, og da glir endene
// av boblene underveis. I stedet regnes linjen ut fra begge endepunktene i hvert steg.
function animateEdges(before: Positions, after: Positions) {
  for (const [a, b] of links) {
    let previousAngle: number | undefined
    const frames = Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS
      const p = lerp(before[a], after[a], t)
      const q = lerp(before[b], after[b], t)
      let angle = Math.atan2(q.y - p.y, q.x - p.x)
      // Unngå at linjen snurrer en hel runde når vinkelen krysser ±π
      if (previousAngle !== undefined) {
        while (angle - previousAngle > Math.PI) angle -= Math.PI * 2
        while (angle - previousAngle < -Math.PI) angle += Math.PI * 2
      }
      previousAngle = angle
      const { width, transform } = edgeStyle(p, q, angle)
      // Gruppen roterer rundt midten sin, linjen rundt venstre ende
      return { offset: t, width, transform: `translate(-50%, -50%) ${transform} translate(50%, 50%)` }
    })

    document.documentElement.animate(frames, {
      duration: DURATION,
      easing: EASING,
      pseudoElement: `::view-transition-group(${edgeName(a, b)})`,
    })
  }
}

export function MindMap() {
  const board = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State | null>(null)

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const size = { width: entry.contentRect.width, height: entry.contentRect.height }
      setState((s) => {
        const focus = s?.focus ?? ROOT
        return { focus, size, layout: layout(focus, ids, links, size, s?.layout.positions) }
      })
    })
    observer.observe(board.current!)
    return () => observer.disconnect()
  }, [])

  const select = (id: string) => {
    if (!state || id === state.focus) return

    const before = nodeCenters(board.current!)
    const next: State = {
      ...state,
      focus: id,
      layout: layout(id, ids, links, state.size, state.layout.positions),
    }

    const transition = withViewTransition(() => setState(next), ['mindmap'])
    if (!transition || prefersReducedMotion()) return

    transition.ready.then(() => animateEdges(before, nodeCenters(board.current!))).catch(() => {})
  }

  const focus = state?.focus ?? ROOT
  const topic = topics.find((t) => t.id === focus)!
  const scale = state ? Math.min(1, Math.max(0.6, Math.min(state.size.width, state.size.height) / 640)) : 1

  return (
    <div className="mindmap">
      <div className="board" ref={board} style={{ '--scale': scale } as CSSProperties}>
        {state &&
          links.map(([a, b]) => (
            <div
              key={edgeName(a, b)}
              className={`edge${a === focus || b === focus ? ' is-active' : ''}`}
              style={{
                ...edgeStyle(state.layout.positions[a], state.layout.positions[b]),
                viewTransitionName: edgeName(a, b),
              }}
            />
          ))}

        {state &&
          topics.map((t) => {
            const { x, y } = state.layout.positions[t.id]
            return (
              <button
                key={t.id}
                type="button"
                className="node"
                data-node={t.id}
                data-depth={Math.min(state.layout.depth[t.id], 3)}
                aria-current={t.id === focus || undefined}
                style={{ left: x, top: y, viewTransitionName: `node-${t.id}` }}
                onClick={() => select(t.id)}
              >
                {t.label}
              </button>
            )
          })}
      </div>

      <div className="topic" aria-live="polite">
        <h2>{topic.label.replace('­', '')}</h2>
        <p>{topic.text}</p>
      </div>
    </div>
  )
}
