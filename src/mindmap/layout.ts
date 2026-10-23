export type Point = { x: number; y: number }
export type Positions = Record<string, Point>
export type Layout = { positions: Positions; depth: Record<string, number> }

const TAU = Math.PI * 2

function neighbours(links: [string, string][]) {
  const map: Record<string, string[]> = {}
  for (const [a, b] of links) {
    ;(map[a] ??= []).push(b)
    ;(map[b] ??= []).push(a)
  }
  return map
}

// Bredde-først fra fokus: gir ringnummer og hvilken node hver node henger på
function rings(focus: string, ids: string[], links: [string, string][]) {
  const adj = neighbours(links)
  const depth: Record<string, number> = { [focus]: 0 }
  const parent: Record<string, string> = {}
  const queue = [focus]
  for (let id = queue.shift(); id; id = queue.shift()) {
    for (const next of adj[id] ?? []) {
      if (next in depth) continue
      depth[next] = depth[id] + 1
      parent[next] = id
      queue.push(next)
    }
  }
  for (const id of ids) depth[id] ??= 1
  return { depth, parent }
}

// Fordeler n vinkler jevnt, men roterer ringen så den ligger nærmest ønsket vinkel
function spread(wanted: number[]) {
  const step = TAU / wanted.length
  let sin = 0
  let cos = 0
  wanted.forEach((angle, i) => {
    sin += Math.sin(angle - i * step)
    cos += Math.cos(angle - i * step)
  })
  const offset = Math.atan2(sin, cos)
  return wanted.map((_, i) => offset + i * step)
}

const angleOf = (from: Point, to: Point) => Math.atan2(to.y - from.y, to.x - from.x)

export function layout(
  focus: string,
  ids: string[],
  links: [string, string][],
  size: { width: number; height: number },
  previous?: Positions,
): Layout {
  const { depth, parent } = rings(focus, ids, links)
  const maxDepth = Math.max(...Object.values(depth))
  const center = { x: size.width / 2, y: size.height / 2 }
  const pad = Math.min(size.width, size.height) * 0.11
  const rx = size.width / 2 - pad
  const ry = size.height / 2 - pad

  const angle: Record<string, number> = { [focus]: 0 }
  const positions: Positions = { [focus]: center }

  for (let d = 1; d <= maxDepth; d++) {
    const ring = ids.filter((id) => depth[id] === d)

    // Ring 1 beholder retningen den hadde fra forrige fokus, så kartet "dreier" naturlig.
    // Ytre ringer legger seg utenfor noden de henger på.
    const wanted = ring.map((id, i) => {
      if (d === 1) {
        return previous ? angleOf(previous[focus], previous[id]) : (i / ring.length) * TAU - Math.PI / 2
      }
      return angle[parent[id]]
    })

    const order = ring.map((_, i) => i).sort((a, b) => norm(wanted[a]) - norm(wanted[b]))
    const placed = spread(order.map((i) => wanted[i]))

    order.forEach((i, k) => {
      const id = ring[i]
      angle[id] = placed[k]
      const r = maxDepth === 1 ? 0.75 : 0.42 + (0.58 * (d - 1)) / (maxDepth - 1)
      positions[id] = {
        x: center.x + Math.cos(placed[k]) * rx * r,
        y: center.y + Math.sin(placed[k]) * ry * r,
      }
    })
  }

  return { positions, depth }
}

const norm = (a: number) => ((a % TAU) + TAU) % TAU
