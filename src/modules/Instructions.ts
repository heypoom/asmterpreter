import {assoc, assocPath} from 'ramda'

import {MachineState, Register} from './Machine'
import {Flags} from './Flags'

export const mov = (
  s: MachineState,
  reg: Register,
  value: number,
): MachineState => assocPath(['registers', reg], value, s)

export const memset = (
  s: MachineState,
  address: number,
  value: number,
): MachineState => assocPath(['memory', address], value, s)

export const setFlag = (s: MachineState, flags: Partial<Flags>): MachineState =>
  assoc('flags', {...s.flags, ...flags}, s)

export const jmp = (s: MachineState, address: number) => mov(s, 'eip', address)

export const get = (s: MachineState, reg: Register) => s.registers[reg] || 0

export const memget = (s: MachineState, address: number) =>
  s.memory[address] || 0

export const push = (s: MachineState, value: number) =>
  memset(s, get(s, 'esp'), value)

export const pop = (s: MachineState, reg: Register) =>
  mov(s, reg, memget(s, get(s, 'esp')))

export const xor = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) ^ value)

export const add = (s: MachineState, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) + value)

export const sub = (s: MachineState, reg: Register, value: number) =>
  add(s, reg, -value)

export const inc = (s: MachineState, reg: Register) => add(s, reg, 1)
export const dec = (s: MachineState, reg: Register) => sub(s, reg, 1)

export function cmp(s: MachineState, dstVal: number, srcVal: number) {
  if (dstVal === srcVal) return setFlag(s, {zero: true, carry: false})

  if (dstVal < srcVal) return setFlag(s, {zero: false, carry: true})

  return setFlag(s, {zero: false, carry: false})
}

const isEqual = (flags: Flags) => flags.zero && !flags.carry
const isLess = (flags: Flags) => !flags.zero && flags.carry
const isAbove = (flags: Flags) => !flags.zero && !flags.carry

const jumpIf = (s: MachineState, address: number, pred: boolean) =>
  pred ? jmp(s, address) : s

export const je = (s: MachineState, address: number) =>
  jumpIf(s, address, isEqual(s.flags))

export const jne = (s: MachineState, address: number) =>
  jumpIf(s, address, !isEqual(s.flags))

// Jump if lesser
export const jl = (s: MachineState, address: number) =>
  jumpIf(s, address, isLess(s.flags))

// Jump if above
export const ja = (s: MachineState, address: number) =>
  jumpIf(s, address, isAbove(s.flags))

// Jump if less or equal
export const jle = (s: MachineState, address: number) =>
  jumpIf(s, address, isLess(s.flags) || isEqual(s.flags))

// Jump if above or equal
export const jae = (s: MachineState, address: number) =>
  jumpIf(s, address, isAbove(s.flags) || isEqual(s.flags))

// Jump if zero flag is set
export const jz = (s: MachineState, address: number) =>
  jumpIf(s, address, s.flags.zero)

// Jump if zero flag is not set
export const jnz = (s: MachineState, address: number) =>
  jumpIf(s, address, !s.flags.zero)
