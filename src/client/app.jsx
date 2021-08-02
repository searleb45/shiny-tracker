import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';

// import Home from './pages/_async/async-home';
// import ActiveHunts from './pages/_async/async-active-hunts';
// import CompletedHunts from './pages/_async/async-completed-hunts';
// import Shinydex from './pages/_async/async-shinydex';
const Home = React.lazy(() => import('./pages/home'));
const ActiveHunts = React.lazy(() => import('./pages/active-hunts'));
const CompletedHunts = React.lazy(() => import('./pages/completed-hunts'));
const Shinydex = React.lazy(() => import('./pages/shinydex'));

import Header from './components/header';

const App = () => {

	const userAuthenticated = useSelector(state => state.user.authenticated);

	return (
		<Router>
			<Header />
			<div className="page-content">
				<Switch>
					<React.Suspense fallback={<h2>Loading...</h2>}>
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
					</React.Suspense>
				</Switch>
			</div>
		</Router>
	)
}

export default App;