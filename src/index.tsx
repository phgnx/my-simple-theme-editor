import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from '@reach/router'
import './index.css'
import AppComponent from './App/AppComponent'

interface Props {
  path: '/'
}
const Controller: React.FC<Props> = ({ path }) => <AppComponent />

ReactDOM.render(
  <Router>
    <Controller path="/" />
  </Router>,
  document.getElementById('root')
)
