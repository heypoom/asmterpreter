import {assocPath} from 'ramda'

const Registers = ['eip', 'esp', 'eax', 'ebx', 'ecx', 'nul'] as const
const Ops = ['mov', 'xor', 'push', 'pop', 'jmp'] as const

type Register = typeof Registers[number]
type Op = typeof Ops[number]

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

let s = Machine()

s = mov(s, 'eax', 20) //?
s = jmp(s, 0x10) //?
s = mov(s, 'esp', 5) //?
s = push(s, 0xdead) //?
s = pop(s, 'ecx') //?
s = xor(s, 'ecx', get(s, 'ecx')) //?

const REGS = Registers as ReadonlyArray<string>

function toReg(reg: string): Register {
  if (!REGS.includes(reg)) return 'nul'

  return reg as Register
}

function toVal(s: State, str: string) {
  if (REGS.includes(str)) return get(s, toReg(str))

  return Number(str) || 0
}

function interpret(s: State, code: string): State {
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

let sm = Machine() //?

sm = interpret(sm, 'mov eax, 0xdead') //?
sm = interpret(sm, 'xor eax, eax') //?
sm = interpret(sm, 'mov esp, 5') //?
sm = interpret(sm, 'push 0xbeef') //?
sm = interpret(sm, 'pop ecx') //?
sm = interpret(sm, 'xor ecx, esp') //?
sm = interpret(sm, 'jmp ecx') //?

const runLines = (lines: string, m: State = Machine()): State =>
  lines.split('\n').reduce((s: State, line: string) => interpret(s, line), m)

runLines(`
  mov eax, 50
  mov ecx, 20
  xor ecx, eax
  jmp 20
  mov esp, 15
  push 0xdead
  pop ebx
`) //?
