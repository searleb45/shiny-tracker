import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from 'react-router-dom';

const App = () => {
	return (
		<>
		<header>This is the header element</header>
		<Router>
			<Switch>
				<Route exact path="/">
					<div>This is the homepage content</div>
					<Link to="/hunts">Go to hunts page</Link>
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