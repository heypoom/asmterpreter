import React from 'react'
import {useObserver} from 'mobx-react-lite'
import styled from '@emotion/styled'

export function App() {
  return useObserver(() => (
    <div>
      <div>Hello, World!</div>
    </div>
  ))
}
