import React from 'react';
import SignIn from '../../components/signin';

import './home.scss';

const Home = () => {
	return (
		<main className="home">
			<section>
				<div className="divider-center">
					<h1>Welcome to SparkleTracker!</h1>
					<p>SparkleTracker is an easy way to keep track of your Pokémon shiny hunts! Keep track of multiple hunts, odds, encounters, and more with our Hunt Tracker, then use the Shinydex to keep track of your collection across games!</p>
					<SignIn text="Try it now!" />
				</div>
			</section>
		</main>
	)
};

export default Home;