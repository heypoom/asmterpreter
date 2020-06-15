import {MachineState, Machine} from './Machine'
import {interpret} from './Interpret'
import {get, inc} from './Instructions'

export type ProgramState = {
  program: string[]
  machine: MachineState
}

export const Program = (): ProgramState => ({program: [], machine: Machine()})

export type ActionTypes = 'ADD_LINE' | 'EXECUTE' | 'RUN_LINE' | 'RUN'

export const RUN: ProgramAction = {type: 'RUN', payload: {}}

export const addLine = (line: string): ProgramAction => ({
  type: 'ADD_LINE',
  payload: line,
})

const createReducer = (
  s: ProgramState,
): Record<ActionTypes, (args: any) => ProgramState> => ({
  ADD_LINE: (p: string) => ({...s, program: [...s.program, p]}),
  EXECUTE: (p: string) => ({...s, machine: interpret(s.machine, p)}),

  RUN: () => {
    let ip = get(s.machine, 'eip')
    let line = s.program[ip]

    let m = interpret(s.machine, line)
    if (!line.startsWith('jmp')) m = inc(m, 'eip')

    return {...s, machine: m}
  },

  RUN_LINE: (p: number = 0) => ({
    ...s,
    machine: interpret(s.machine, s.program[p]),
  }),
})

export interface ProgramAction {
  type: ActionTypes
  payload: any
}

export function programReducer(state: ProgramState, action: ProgramAction) {
  const reducers = createReducer(state)
  const r = reducers[action.type]
  if (r) return r(action.payload)

  return state
}
