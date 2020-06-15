import {assocPath} from 'ramda'

import {MachineState, Register} from './Machine'

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
