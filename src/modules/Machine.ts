import {assocPath} from 'ramda'

const _registers = ['eip', 'esp', 'eax', 'ebx', 'ecx', 'nul'] as const
const _ops = ['mov', 'xor', 'push', 'pop', 'jmp'] as const

type Register = typeof _registers[number]
type Op = typeof _ops[number]

const registers = _registers as ReadonlyArray<string>

interface State {
  registers: Partial<Record<Register, number>>
  memory: Record<number, number>
}

const mov = (s: State, reg: Register, value: number): State =>
  assocPath(['registers', reg], value, s)

const memset = (s: State, address: number, value: number): State =>
  assocPath(['memory', address], value, s)

const jmp = (s: State, address: number) => mov(s, 'eip', address)

const get = (s: State, reg: Register) => s.registers[reg] || 0
const memget = (s: State, address: number) => s.memory[address] || 0

const push = (s: State, value: number) => memset(s, get(s, 'esp'), value)

const pop = (s: State, reg: Register) => mov(s, reg, memget(s, get(s, 'esp')))

const xor = (s: State, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) ^ value)

const Machine = (): State => ({registers: {}, memory: {}})

export function toReg(reg: string): Register {
  if (!registers.includes(reg)) return 'nul'

  return reg as Register
}

export function toVal(s: State, str: string) {
  if (registers.includes(str)) return get(s, toReg(str))

  return Number(str) || 0
}

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
