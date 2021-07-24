import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	return (
		<main>
			<div>This is the homepage content - now in its own component!</div>
			<Link to="/active-hunts">Go to hunts page</Link>
		</main>
	)
};

export default Home;