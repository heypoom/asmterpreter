import {MachineState, Op, toReg, toVal, Machine} from './Machine'
import {mov, pop, push, xor, jmp, inc, dec, add, sub} from './Instructions'

export function interpret(s: MachineState, code: string): MachineState {
  const [op, a, b] = code
    .trim()
    .replace(',', '')
    .split(' ') as [Op, string, string]

  const dst = toReg(a)
  const val = toVal(s, a)
  const srcVal = toVal(s, b)

  const handlers: Record<Op, () => MachineState> = {
    mov: () => mov(s, dst, srcVal),
    pop: () => pop(s, dst),
    push: () => push(s, val),
    xor: () => xor(s, dst, srcVal),
    jmp: () => jmp(s, val),
    inc: () => inc(s, dst),
    dec: () => dec(s, dst),
    add: () => add(s, dst, srcVal),
    sub: () => sub(s, dst, srcVal),
  }

  const handle = handlers[op]
  if (handle) return handle()

  return s
}

export const runLines = (lines: string, m = Machine()): MachineState =>
  lines.split('\n').reduce(interpret, m)
