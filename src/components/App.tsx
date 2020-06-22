import React, {useReducer, useState} from 'react'
import styled from '@emotion/styled'

import {programReducer, Program} from '../modules/Program'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1em;
  max-width: 1000px;
  margin: 0 auto;
`

const Code = styled.code`
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  font-size: 20px;
  line-height: 1.3;
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  border: 1px solid #eee;
  outline: none;
`

const Pre = styled.pre`
  width: 100%;
`

export function App() {
  const [state, dispatch] = useReducer(programReducer, Program())
  const [code, setCode] = useState('')
  const [irCode, setIRCode] = useState('')

  const step = () => dispatch({type: 'RUN', payload: {}})

  function run() {
    dispatch({type: 'ADD', payload: code})
    step()
    setCode('')
  }

  function runIR() {
    dispatch({type: 'ASSEMBLE', payload: irCode})
    step()
    setIRCode('')
  }

  return (
    <Container>
      <Pre>
        <Code>{JSON.stringify(state, null, 2)}</Code>
      </Pre>

      <div>
        <Input
          placeholder="Assembly Code"
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && run()}
        />

        <Input
          placeholder="JS IR Code"
          value={irCode}
          onChange={e => setIRCode(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && runIR()}
        />

        <button onClick={step}>Step</button>
      </div>
    </Container>
  )
}
