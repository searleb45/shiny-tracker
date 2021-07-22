import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import Home from './pages/home';

const App = () => {
	return (
		<>
		<header>This is the header element</header>
		<Router>
			<Switch>
				<Route exact path="/">
					<Home />
				</Route>
				<Route path="/hunts">
					<div>This is the hunts page</div>
					<a href="#" onClick={() => history.back()}>Back</a>
				</Route>
			</Switch>
		</Router>
		</>
	)
}

export default App;