import {State, Op, toReg, toVal, Machine} from './Machine'
import {mov, pop, push, xor, jmp} from './Instructions'

export function interpret(s: State, code: string): State {
  const [op, a, b] = code
    .trim()
    .replace(',', '')
    .split(' ') as [Op, string, string]

  const dst = toReg(a)
  const val = toVal(s, a)
  const srcVal = toVal(s, b)

  const handlers: Record<Op, () => State> = {
    mov: () => mov(s, dst, srcVal),
    pop: () => pop(s, dst),
    push: () => push(s, val),
    xor: () => xor(s, dst, srcVal),
    jmp: () => jmp(s, val),
  }

  const handle = handlers[op]
  if (handle) return handle()

  return s
}

export const runLines = (lines: string, m = Machine()): State =>
  lines.split('\n').reduce(interpret, m)
