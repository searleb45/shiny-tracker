import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import SignIn from '../signin';
import Logo from '../logo';
import './header.scss';

const UnauthedHeader = () => {
	return (
		<header>
			<Logo />
			<div className="signin-container">
				<SignIn />
			</div>
		</header>
	);
}

const AuthedHeader = () => {
	return (
		<header>
			<Link to="/" className="header-logo">

			</Link>
		</header>
	)
}

const Header = () => {
	const location = useLocation();
	if(location.pathname === '/') {
		return (<UnauthedHeader />);
	}

	return (<header>Authenticated</header>);
}

export default Header;