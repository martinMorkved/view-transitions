export type Topic = {
  id: string
  label: string
  text: string
}

export const ROOT = 'vt'

export const topics: Topic[] = [
  {
    id: 'vt',
    label: 'View Transitions',
    text: 'Nettleseren tar et bilde av siden før og etter en endring, og animerer mellom dem. Du endrer bare DOM-en.',
  },
  {
    id: 'same',
    label: 'Samme side',
    text: 'document.startViewTransition(update) – brukes i SPA-er. Bildet tas før update kjører, og igjen etterpå.',
  },
  {
    id: 'cross',
    label: 'Mellom sider',
    text: '@view-transition { navigation: auto; } på begge sidene. Bare innenfor samme opphav.',
  },
  {
    id: 'names',
    label: 'Navn',
    text: 'view-transition-name gir et element sin egen gruppe. Samme navn før og etter = elementet morpher. Må være unikt på siden.',
  },
  {
    id: 'pseudo',
    label: 'Pseudo­elementer',
    text: '::view-transition-group, -image-pair, -old og -new. Et tre av pseudo-elementer som ligger over siden mens overgangen kjører.',
  },
  {
    id: 'snapshot',
    label: 'Bilder',
    text: 'Gammel tilstand er et stillbilde, ny tilstand er levende. Derfor kan ikke innholdet endre seg midt i animasjonen.',
  },
  {
    id: 'anim',
    label: 'Animasjon',
    text: 'Vanlige CSS-animasjoner på pseudo-elementene. Standard er en kryssfade på root og en morph av posisjon og størrelse på gruppene.',
  },
  {
    id: 'classes',
    label: 'Klasser',
    text: 'view-transition-class lar mange navngitte elementer dele samme stil: ::view-transition-group(*.boble).',
  },
  {
    id: 'types',
    label: 'Typer',
    text: 'startViewTransition({ update, types: ["tema"] }) og :active-view-transition-type(tema) i CSS. Temabryteren her bruker det.',
  },
  {
    id: 'object',
    label: 'Promises',
    text: 'ViewTransition har updateCallbackDone, ready og finished. I ready finnes pseudo-elementene, så de kan animeres med element.animate().',
  },
  {
    id: 'lines',
    label: 'Linjene her',
    text: 'En linje som bare morpher ville glidd av boblene. I ready regnes egne keyframes for hver linje ut fra boblenes start- og sluttpunkt.',
  },
  {
    id: 'react',
    label: 'React',
    text: 'React oppdaterer DOM-en asynkront. Pakk setState i flushSync inne i update, ellers tas «etter»-bildet for tidlig.',
  },
  {
    id: 'events',
    label: 'pageswap / pagereveal',
    text: 'Hendelser på gammel og ny side. Brukes til å sette navn eller typer basert på hvor du navigerer fra og til.',
  },
  {
    id: 'fallback',
    label: 'Fallback',
    text: 'Uten støtte kjører du bare oppdateringen. Og prefers-reduced-motion bør skru av animasjonene.',
  },
]

export const links: [string, string][] = [
  ['vt', 'same'],
  ['vt', 'cross'],
  ['vt', 'names'],
  ['vt', 'pseudo'],
  ['vt', 'fallback'],
  ['names', 'classes'],
  ['names', 'snapshot'],
  ['pseudo', 'anim'],
  ['pseudo', 'snapshot'],
  ['same', 'object'],
  ['same', 'react'],
  ['same', 'types'],
  ['cross', 'types'],
  ['cross', 'events'],
  ['object', 'lines'],
  ['anim', 'lines'],
]
