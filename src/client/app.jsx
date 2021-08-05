import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import OfflineWarningBanner from './components/offline-warning-banner';

const Home = React.lazy(() => import(/* webpackChunkName: 'home' */'./pages/home'));
const ActiveHunts = React.lazy(() => import(/* webpackChunkName: 'active-hunts' */'./pages/active-hunts'));
const CompletedHunts = React.lazy(() => import(/* webpackChunkName: 'completed-hunts' */'./pages/completed-hunts'));
const Shinydex = React.lazy(() => import(/* webpackChunkName: 'shinydex' */'./pages/shinydex'));

import Header from './components/header';

const App = () => {
	const userAuthenticated = useSelector(state => state.user.authenticated);

	return (
		<Router>
			<Header />
			<div className="page-content">
				<OfflineWarningBanner />
				<Switch>
					<React.Suspense fallback={<h2 className="loading-msg">Loading...</h2>}>
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