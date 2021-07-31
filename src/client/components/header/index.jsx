import React from 'react';
import { useSelector } from 'react-redux';
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
	return (
		<header className="site-header authorized">
			<div className="header-container">
				<div className="nav-links">
					<Logo />
					{/* TODO: Add links */}
				</div>
				<UserWidget username={username} picture={picture}/>
			</div>
		</header>
	)
}

const Header = () => {
	const isAuthed = useSelector(state => state.user.authenticated);
	return isAuthed ? <AuthedHeader /> : <UnauthedHeader />;
}

export default Header;