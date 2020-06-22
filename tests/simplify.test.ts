import {simplify} from '../src/modules/Simplify'

const trim = (str: string) =>
  str
    .trim()
    .split('\n')
    .map(x => x.trim())
    .join('\n')

describe('simplify module', () => {
  it('should simplify mov instructions', () => {
    expect(simplify('mov eax, ebx')).toBe('a = b')
    expect(simplify('mov ebx, 5')).toBe('b = 5')
    expect(simplify('mov ecx, ecx')).toBe('c = c')
    expect(simplify('mov edx, 0x12')).toBe('d = 0x12')
  })

  it('should simplify polynomial program', () => {
    let code = `
      mov eax, 2

      int 0x80
      push ecx

      int 0x80
      push ecx

      pop eax
      pop ebx

      mov ecx, eax
      mul ecx, ecx
      mov edx, ecx

      mov ecx, 2
      mul ecx, eax
      mul ecx, ebx
      add edx, ecx

      mov ecx, ebx
      mul ecx, ecx
      add edx, ecx
    `

    let output = `
      a = 2

      interrupt(0x80)
      stack.push(c)

      interrupt(0x80)
      stack.push(c)

      a = stack.pop()
      b = stack.pop()

      c = a
      c *= c
      d = c

      c = 2
      c *= a
      c *= b
      d += c

      c = b
      c *= c
      d += c
    `

    expect(simplify(code)).toBe(trim(output))
  })
})
