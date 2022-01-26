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
				<React.Suspense fallback={<h2 className="loading-msg">Loading...</h2>}>
					<Switch>
							{
								userAuthenticated ? (
									<>
										<Route path="/active-hunts" component={ActiveHunts} />
										<Route path="/completed-hunts" component={CompletedHunts} />
										<Route path="/shinydex" component={Shinydex} />
										<Route path="*" component={ActiveHunts} />
									</>
								) : (
									<>
										<Route exact path="/" component={Home} />
										<Redirect to="/" />
									</>
								)
							}
					</Switch>
				</React.Suspense>
			</div>
		</Router>
	)
}

export default App;