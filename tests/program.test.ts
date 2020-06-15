import {Program, programReducer, RUN} from '../src/modules/Program'

const r = programReducer

describe('program', () => {
  it('should be able to run added lines', () => {
    let p = Program()
    p = r(p, {type: 'ADD_LINE', payload: 'mov eax, 0xbeef'})
    p = r(p, {type: 'ADD_LINE', payload: 'xor eax, eax'})
    p = r(p, {type: 'ADD_LINE', payload: 'inc eax'})
    p = r(p, {type: 'ADD_LINE', payload: 'jmp 0'})

    // 0) mov eax, 0xbeef
    p = r(p, RUN) //?
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)

    // 1) xor eax, eax
    p = r(p, RUN) //?
    expect(p.machine.registers.eax).toBe(0)
    expect(p.machine.registers.eip).toBe(2)

    // 2) inc eax
    p = r(p, RUN) //?
    expect(p.machine.registers.eax).toBe(1)
    expect(p.machine.registers.eip).toBe(3)

    // 3) jmp 0
    p = r(p, RUN) //?
    expect(p.machine.registers.eip).toBe(0)

    // 1) mov eax, 0xbeef
    p = r(p, RUN) //?
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)
  })
})
