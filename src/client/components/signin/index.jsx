import React from 'react';
import './signin.scss';

const SignIn = (props) => {
	return (
		<a href="/twitchAuth" className="signin">
			<div className="signin-text-container">{props.text || 'Sign in with Twitch'}</div>
		</a>
	)
}

export default SignIn;