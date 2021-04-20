import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Company from './components/Company'
import Location from './components/Location'
import Industry from './components/Industry'
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
          <Route exact={false} path="/company" render={() => <Company />} />
        </Switch>
        <Switch>
          <Route exact={false} path="/location" render={() => <Location />} />
        </Switch>
        <Switch>
          <Route exact={false} path="/industry" render={() => <Industry />} />
        </Switch>
      </Router>
    </div>
    </ThemeProvider>
  )
}

export default App
