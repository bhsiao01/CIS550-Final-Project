import React from 'react'
import firebase from 'firebase/app'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/login'
import Company from './components/Company'
import Location from './components/Location'
import Industry from './components/Industry'
import PriceRange from './components/PriceRange'
import { ThemeProvider, CssBaseline } from '@material-ui/core'
import theme from './theme'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        <div className="App">
          <Router>
            <Switch>
              <Route exact path="/" render={() => <Login />} />
            </Switch>
            <Switch>
              <Route exact path="/home" render={() => <Home />} />
            </Switch>
            <Switch>
              <Route exact={false} path="/company" render={() => <Company />} />
            </Switch>
            <Switch>
              <Route
                exact={false}
                path="/location"
                render={() => <Location />}
              />
            </Switch>
            <Switch>
              <Route
                exact={false}
                path="/industry"
                render={() => <Industry />}
              />
            </Switch>
            <Switch>
              <Route
                exact={false}
                path="/price"
                render={() => <PriceRange />}
              />
            </Switch>
          </Router>
        </div>
      </CssBaseline>
    </ThemeProvider>
  )
}

export default App
