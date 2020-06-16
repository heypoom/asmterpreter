import {
  Program,
  programReducer,
  RUN,
  addLine,
  ProgramState,
} from '../src/modules/Program'

const r = programReducer
const run = (p: ProgramState) => r(p, RUN)

describe('program', () => {
  it('should be able to run added lines', () => {
    let p = Program()
    p = r(p, addLine('mov eax, 0xbeef'))
    p = r(p, addLine('xor eax, eax'))
    p = r(p, addLine('inc eax'))
    p = r(p, addLine('jmp 0'))

    // 0) mov eax, 0xbeef
    p = run(p) //?
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)

    // 1) xor eax, eax
    p = run(p) //?
    expect(p.machine.registers.eax).toBe(0)
    expect(p.machine.registers.eip).toBe(2)

    // 2) inc eax
    p = run(p) //?
    expect(p.machine.registers.eax).toBe(1)
    expect(p.machine.registers.eip).toBe(3)

    // 3) jmp 0
    p = run(p) //?
    expect(p.machine.registers.eip).toBe(0)

    // 0) mov eax, 0xbeef
    p = run(p) //?
    expect(p.machine.registers.eax).toBe(0xbeef)
    expect(p.machine.registers.eip).toBe(1)
  })
})
