import {assocPath} from 'ramda'

import {State, Register} from './Machine'

export const mov = (s: State, reg: Register, value: number): State =>
  assocPath(['registers', reg], value, s)

export const memset = (s: State, address: number, value: number): State =>
  assocPath(['memory', address], value, s)

export const jmp = (s: State, address: number) => mov(s, 'eip', address)

export const get = (s: State, reg: Register) => s.registers[reg] || 0

export const memget = (s: State, address: number) => s.memory[address] || 0

export const push = (s: State, value: number) => memset(s, get(s, 'esp'), value)

export const pop = (s: State, reg: Register) =>
  mov(s, reg, memget(s, get(s, 'esp')))

export const xor = (s: State, reg: Register, value: number) =>
  mov(s, reg, get(s, reg) ^ value)
