import React from 'react';
import { useCookies } from 'react-cookie';
import { AUTH_COOKIE } from '../../constants';
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
	return (
		<header>
			<div className="nav-links">
				<Logo />
				{/* TODO: Add links */}
			</div>
			{/* <UserWidget username={CookieHelper.read('username')} picture={CookieHelper.read('picture_url')}/> */}
		</header>
	)
}

const Header = () => {
	const [cookies] = useCookies([AUTH_COOKIE]);
	return cookies[AUTH_COOKIE] ? <AuthedHeader /> : <UnauthedHeader />;
}

export default Header;