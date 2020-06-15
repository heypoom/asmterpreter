import {get} from './Instructions'

const _registers = ['eip', 'esp', 'eax', 'ebx', 'ecx', 'nul'] as const
const _ops = ['mov', 'xor', 'push', 'pop', 'jmp'] as const

export type Register = typeof _registers[number]
export type Op = typeof _ops[number]

const registers = _registers as ReadonlyArray<string>

export interface State {
  registers: Partial<Record<Register, number>>
  memory: Record<number, number>
}

export const Machine = (): State => ({registers: {}, memory: {}})

export function toReg(reg: string): Register {
  if (!registers.includes(reg)) return 'nul'

  return reg as Register
}

export function toVal(s: State, str: string) {
  if (registers.includes(str)) return get(s, toReg(str))

  return Number(str) || 0
}
