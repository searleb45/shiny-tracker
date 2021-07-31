import React from 'react';
import { Link } from 'react-router-dom';
import './logo.scss';

import pokeBall from '../../static/icons/Pokeball.png';

const Logo = () => {
	return (
		<Link to="/" className="header-logo">
			<span className="logo-ball-container">
				<img src={pokeBall} />
			</span>
			<span className="logo-text">ShinyTrack</span>
		</Link>
	)
};

export default Logo;