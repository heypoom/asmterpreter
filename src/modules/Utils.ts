export const trim = (str: string) =>
  str
    .trim()
    .split('\n')
    .map(x => x.trim())
    .join('\n')
