import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Online } from 'react-detect-offline';
import Logo from '../logo';
import SignIn from '../signin';
import UserWidget from '../user-widget';
import './header.scss';

const UnauthedHeader = () => {
	return (
		<header className="site-header unauthorized">
			<div className="header-container">
				<Logo />
				<div className="signin-container">
					<SignIn />
				</div>
			</div>
		</header>
	);
}

const AuthedHeader = () => {
	const username = useSelector(state => state.user.username);
	const picture = useSelector(state => state.user.picture);

	const navLinks = 
		<Online polling={{enabled: false}}>
			<NavLink activeClassName="active" to="/active-hunts">Active Hunts</NavLink>
			<NavLink activeClassName="active" to="/completed-hunts">Completed Hunts</NavLink>
			<NavLink activeClassName="active" to="/shinydex">Shinydex</NavLink>
		</Online>;

	return (
		<header className="site-header authorized">
			<div className="header-container">
				<div className="nav-links">
					<Logo />
					<div className="nav-links-desktop">
						{navLinks}
					</div>
				</div>
				<UserWidget username={username} picture={picture} links={navLinks}/>
			</div>
		</header>
	)
}

const Header = () => {
	const isAuthed = useSelector(state => state.user.authenticated);
	return isAuthed ? <AuthedHeader /> : <UnauthedHeader />;
}

export default Header;