import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => <Dashboard />}
						/>
					</Switch>
				</Router>
    </div>
  );
}

export default App;
