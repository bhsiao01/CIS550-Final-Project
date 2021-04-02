import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Home from './components/Home'
import Stock from './components/Stock'
import Housing from './components/Housing'

function App() {
  return (
    <div className="App">
      <Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Home />}
						/>
					</Switch>
					<Switch>
						<Route
							exact
							path="/stock"
							render={() => <Stock />}
						/>
					</Switch>
					<Switch>
						<Route
							exact
							path="/housing"
							render={() => <Housing />}
						/>
					</Switch>
				</Router>
    </div>
  );
}

export default App;
