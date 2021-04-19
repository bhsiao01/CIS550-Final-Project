import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Stock from './components/Stock'
import Location from './components/Location'
import {ThemeProvider} from '@material-ui/core'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
        </Switch>
        <Switch>
          <Route exact path="/company/*" render={() => <Stock />} />
        </Switch>
        <Switch>
          <Route exact path="/location/*" render={() => <Location />} />
        </Switch>
      </Router>
    </div>
    </ThemeProvider>
  )
}

export default App
