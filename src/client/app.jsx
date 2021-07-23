import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';

const App = () => {
	return (
		<>
		<Router>
			<Header />
			<div className="page-content">
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/hunts">
						<div>This is the hunts page</div>
						<a href="#" onClick={() => history.back()}>Back</a>
					</Route>
				</Switch>
			</div>
		</Router>
		</>
	)
}

export default App;