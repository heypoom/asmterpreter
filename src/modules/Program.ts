import {MachineState, Machine} from './Machine'
import {interpret} from './Interpret'
import {get, inc} from './Instructions'

export type ProgramState = {
  program: string[]
  machine: MachineState
}

export const Program = (): ProgramState => ({program: [], machine: Machine()})

export type ActionTypes = 'ADD_LINE' | 'EXECUTE' | 'RUN_LINE' | 'RUN'

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

interface Action {
  type: ActionTypes
  payload: any
}

export function programReducer(state: ProgramState, action: Action) {
  const reducers = createReducer(state)
  const r = reducers[action.type]
  if (r) return r(action.payload)

  return state
}
