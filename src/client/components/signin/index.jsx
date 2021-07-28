import React from 'react';
import './signin.scss';

const SignIn = () => {
	return (
		<a href="/twitchAuth" className="signin">
			<div className="signin-text-container">Sign in with Twitch</div>
		</a>
	)
}

export default SignIn;