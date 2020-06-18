import {get} from './Instructions'
import {Flags, EmptyFlags} from './Flags'

const _registers = ['eip', 'esp', 'eax', 'ebx', 'ecx', 'nul'] as const

const _ops = [
  'mov',
  'xor',
  'push',
  'pop',
  'jmp',
  'add',
  'sub',
  'inc',
  'dec',
] as const

export type Register = typeof _registers[number]
export type Op = typeof _ops[number]

const registers = _registers as ReadonlyArray<string>

export interface MachineState {
  registers: Partial<Record<Register, number>>
  memory: Record<number, number>
  flags: Flags
}

export const Machine = (): MachineState => ({
  registers: {},
  memory: {},
  flags: EmptyFlags,
})

export function toReg(reg: string): Register {
  if (!registers.includes(reg)) return 'nul'

  return reg as Register
}

export function toVal(s: MachineState, str: string) {
  if (registers.includes(str)) return get(s, toReg(str))

  return Number(str) || 0
}
