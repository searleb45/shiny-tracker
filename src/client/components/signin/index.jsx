import React from 'react';
import './signin.scss';

const SignIn = () => {
	function performTwitchLogin() {
		const params = {
			client_id: process.env.TWITCH_CLIENT_ID,
			redirect_uri: `${window.location.origin}/handleAuthRedirect`,
			response_type: 'id_token',
			scope: 'openid user:read:email',
			claims: JSON.stringify({'id_token': {email: null, picture: null, preferred_username: null}}),
			prompt: 'none'
		};

		const queryString = Object.keys(params)
			.map((key) => `${key}=${encodeURIComponent(params[key])}`)
			.join('&');

		window.location.href =`https://id.twitch.tv/oauth2/authorize?${queryString}`;
	}

	return (
		<button className="signin" onClick={performTwitchLogin}>
			<div className="signin-text-container">Sign in with Twitch</div>
		</button>
	)
}

export default SignIn;