import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import Home from './pages/home';
import ActiveHunts from './pages/active-hunts';
import CompletedHunts from './pages/completed-hunts';
import Shinydex from './pages/shinydex';

import Header from './components/header';

const App = () => {

	const userAuthenticated = useSelector(state => state.user.authenticated);

	return (
		<Router>
			<Header />
			<div className="page-content">
				<Switch>
					<Route path="/active-hunts">
						{!userAuthenticated ? <Redirect to="/" /> : <ActiveHunts />}
					</Route>
					<Route path="/completed-hunts">
						{!userAuthenticated ? <Redirect to="/" /> : <CompletedHunts />}
					</Route>
					<Route path="/shinydex">
						{!userAuthenticated ? <Redirect to="/" /> : <Shinydex />}
					</Route>
					<Route exact path="/">
						{userAuthenticated ? <Redirect to="/active-hunts" /> : <Home />}
					</Route>
					<Route path="/">
						{userAuthenticated ? <Redirect to="/active-hunts" /> : <Redirect to="/" />}
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export default App;