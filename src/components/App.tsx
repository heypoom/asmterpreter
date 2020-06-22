import React, {useReducer, useState} from 'react'
import styled from '@emotion/styled'

import {programReducer, Program} from '../modules/Program'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 1em 2.5em;
  max-width: 1000px;
  margin: 0 auto;
  min-height: 100vh;
`

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`

const Code = styled.code`
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  font-size: 20px;
  line-height: 1.4;
`

const Input = styled.input`
  width: 100%;
  height: 100%;
  font-size: 20px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 10px 15px;
  margin: 0.4em 0;
  background: transparent;
  outline: none;
  color: white;

  &::placeholder {
    color: white;
  }
`

const Pre = styled.pre`
  width: 100%;
`

const Button = styled.button`
  font-size: 20px;
  font-family: 'JetBrains Mono', 'FiraCode Nerd Font', 'FiraCode', monospace;
  color: white;
  background: transparent;
  border: 1px solid #bbb;
  border-radius: 8px;
  padding: 10px 15px;
  margin-top: 20px;

  &:hover {
    cursor: pointer;
    color: #121212;
    background: #eee;
  }
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

      <Panel>
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

        <Button onClick={step}>Step</Button>
      </Panel>
    </Container>
  )
}
