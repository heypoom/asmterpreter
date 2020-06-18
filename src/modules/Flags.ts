const flags = [
  'carry',
  'parity',
  'adjust',
  'zero',
  'sign',
  'trap',
  'enableInterrupt',
  'direction',
  'overflow',
] as const

export type Flags = Record<typeof flags[number], boolean>

export const EmptyFlags = flags
  .map(name => ({[name]: false}))
  .reduce((a, b) => ({...a, ...b})) as Flags
