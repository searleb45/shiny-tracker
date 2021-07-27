import React from 'react';
import SignIn from '../../components/signin';

import './home.scss';

const Home = () => {
	return (
		<main className="home">
			<div>This is the homepage content - now in its own component!</div>
			<SignIn />
		</main>
	)
};

export default Home;