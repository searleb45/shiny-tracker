import React from 'react';
import { useCookies } from 'react-cookie';
import { AUTH_COOKIE, PICTURE_COOKIE, USERNAME_COOKIE } from '../../constants';
import Logo from '../logo';
import SignIn from '../signin';
import UserWidget from '../user-widget';
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
	const [cookies] = useCookies([USERNAME_COOKIE, PICTURE_COOKIE]);
	return (
		<header>
			<div className="nav-links">
				<Logo />
				{/* TODO: Add links */}
			</div>
			<UserWidget username={cookies[USERNAME_COOKIE]} picture={cookies[PICTURE_COOKIE]}/>
		</header>
	)
}

const Header = () => {
	const [cookies] = useCookies([AUTH_COOKIE]);
	return cookies[AUTH_COOKIE] ? <AuthedHeader /> : <UnauthedHeader />;
}

export default Header;