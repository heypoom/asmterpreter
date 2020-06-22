import {runLines} from '../src/modules/Interpret'
import {Program, add, step} from '../src/modules/Program'

describe('comparison program', () => {
  it('should be able to run comparison program in pure mode', () => {
    let s = runLines(`
      mov eax, 20
      mov ebx, 40

      add ebx, eax
      sub ebx, 5

      cmp ebx, eax
      ja 0x8
    `)

    s.registers //?

    let code = `
    cmp eax, ebx
    jl 0x5
  `

    s = runLines(code, s)
    s.registers //?
  })

  it('should be able to run comparison program in line-by-line mode', () => {
    let p = Program()

    const code = `
      mov eax, 20
      mov ebx, 40
      add ebx, eax
      sub ebx, 5
      cmp ebx, eax
    `

    p = add(p, code)
    p = step(p)
    expect(p.machine.registers.eax).toBe(20)

    p = step(p)
    expect(p.machine.registers.ebx).toBe(40)

    p = step(p)
    expect(p.machine.registers.ebx).toBe(60)

    p = step(p)
    expect(p.machine.registers.eax).toBe(20)
    expect(p.machine.registers.ebx).toBe(55)

    p = step(p) // 20 < 55
    p.machine.registers //?
  })
})
