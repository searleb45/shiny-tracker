import React, { useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';

import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from './constants';
import { setUser } from './store/actions/user';

import AuthHandler from './pages/auth-handler';
import Home from './pages/home';

import Header from './components/header';

const App = () => {
	const [cookies] = useCookies([AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE]);

	const userAuthenticated = useSelector(state => state.user.id);
	const dispatch = useDispatch();
	useEffect(() => {
		if(cookies[AUTH_COOKIE] && !userAuthenticated) {
			dispatch(setUser(cookies[AUTH_COOKIE], cookies[USERNAME_COOKIE], cookies[PICTURE_COOKIE]));
		}
	});

	return (
		<Router>
			<Header />
			<div className="page-content">
				<Switch>
					<Route exact path="/">
						{userAuthenticated ? <Redirect to="/hunts" /> : <Home />}
					</Route>
					<Route path="/hunts">
						{!userAuthenticated ? <Redirect to="/" /> : (
							<>
							<div>This is the hunts page</div>
							<a href="#" onClick={() => history.back()}>Back</a>
							</>
						)}
					</Route>
					<Route path="/handleAuthRedirect">
						<AuthHandler />
					</Route>
					<Route path="/">
						{userAuthenticated ? <Redirect to="/hunts" /> : <Redirect to="/" />}
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

export default App;