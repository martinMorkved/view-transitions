# view transitions

Et tankekart om [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using), animert med View Transition API.

Trykk på en boble, så flytter den seg til midten og resten av kartet legger seg i ringer rundt etter hvor langt unna de er.

## Hvordan

- Hver boble og hver linje har sin egen `view-transition-name`, og React-oppdateringen kjøres i `flushSync` inne i `document.startViewTransition`.
- Boblene morpher av seg selv. Linjene gjør ikke det: nettleseren ville interpolert rotasjon og lengde hver for seg, og da glir endene av boblene. I `transition.ready` regnes egne keyframes for hver linje ut fra boblenes start- og sluttpunkt ([MindMap.tsx](src/mindmap/MindMap.tsx)).
- Temabryteren bruker en overgang med typen `theme` og animerer `clip-path` på `::view-transition-new(root)` fra der du klikket.

## Kjøre lokalt

```sh
npm install
npm run dev
```
