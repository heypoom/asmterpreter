import {Op, Register} from './Machine'

const simpleOpMap: Record<Op, string> = {
  mov: '$a = $b',
  push: 'stack.push($a)',
  pop: '$a = stack.pop()',
  add: '$a += $b',
  sub: '$a -= $b',
  mul: '$a *= $b',
  div: '$a /= $b',
  xor: '$a ^= $b',
  int: 'interrupt($a)',
  jmp: 'goto($a)',
  inc: '$a++',
  dec: '$a--',
  cmp: 'compare($a, $b)',
  je: 'if (a == b) goto($a)',
  jle: 'if (a <= b) goto($a)',
  jne: 'if (a != b) goto($a)',
  ja: 'if (a > b) goto($a)',
  jae: 'if (a >= b) goto($a)',
  jl: 'if (a < b) goto($a)',
  jz: 'if (isZero(a)) goto($a)',
}

const simpleRegMap: Record<Register, string> = {
  eip: 'IP',
  eax: 'a',
  ebx: 'b',
  ecx: 'c',
  edx: 'd',
  esp: 'SP',
  nul: ' ',
}

export function simplifyArg(arg: string) {
  if (!arg) return '??'

  const reg = simpleRegMap[arg as Register]
  if (reg) return reg

  return arg
}

export function simplifyLine(ins: string) {
  if (!ins) return ''
  if (ins.startsWith('//') || ins.startsWith(';')) return ins

  const [op, a, b] = ins
    .trim()
    .replace(',', '')
    .split(' ')

  let code = simpleOpMap[op as Op]
  if (!code) return `// ${ins}`

  return code.replace(/\$a/g, simplifyArg(a)).replace(/\$b/g, simplifyArg(b))
}

export const simplify = (lines: string) =>
  lines
    .trim()
    .split('\n')
    .map(simplifyLine)
    .join('\n')
