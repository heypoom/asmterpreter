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
  je: 'if ($a == $b) goto($c)',
  jle: 'if ($a <= $b) goto($c)',
  jne: 'if ($a != $b) goto($c)',
  ja: 'if ($a > $b) goto($c)',
  jae: 'if ($a >= $b) goto($c)',
  jl: 'if ($a < $b) goto($c)',
  jz: 'if (isZero($a)) goto($c)',
}

const compareJumpOps: Op[] = ['je', 'jle', 'jne', 'ja', 'jae', 'jl', 'jz']

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

interface SimplifyState {
  cmpA: string
  cmpB: string
}

export const replaceArg = (code: string, a = '', b = '', c = '') =>
  code
    .replace(/\$a/g, simplifyArg(a))
    .replace(/\$b/g, simplifyArg(b))
    .replace(/\$c/g, simplifyArg(c))

export function simplifyLine(
  ins: string,
  ss: SimplifyState,
): [string, SimplifyState] {
  if (!ins) return ['', ss]
  if (ins.startsWith('//') || ins.startsWith(';')) return [ins, ss]

  const [opcode, a, b] = ins
    .trim()
    .replace(',', '')
    .split(' ')

  const op = opcode as Op

  const code = simpleOpMap[op]
  if (!code) return [`// ${ins}`, ss]

  if (op === 'cmp') return ['NUL', {...ss, cmpA: a, cmpB: b}]

  let output = replaceArg(code, a, b)

  if (compareJumpOps.includes(op)) {
    output = replaceArg(code, ss.cmpA, ss.cmpB, a)
  }

  return [output, ss]
}

export function simplify(code: string) {
  const lines = code.trim().split('\n')
  const simplified = []

  let ss: SimplifyState = {cmpA: '', cmpB: ''}

  for (let line of lines) {
    const [result, nextState] = simplifyLine(line, ss)
    ss = nextState

    if (result === 'NUL') continue
    simplified.push(result)
  }

  return simplified.join('\n')
}
