import express from 'express';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from '../client/constants';

const router = express.Router();

const REDIRECT_URI = `${process.env.TWITCH_CALLBACK_URL}/twitchAuth/callback`;
function createQueryString(params) {
	return Object.keys(params)
		.map((key) => `${key}=${encodeURIComponent(params[key])}`)
		.join('&');
}

// Twitch authentication handling
router.get('/', (req, res) => {
	const params = {
		client_id: process.env.TWITCH_CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: 'openid',
		claims: JSON.stringify({'id_token': {picture: null, preferred_username: null}}),
	};

	
	res.redirect(`https://id.twitch.tv/oauth2/authorize?${createQueryString(params)}`);
	
});

router.get('/callback', async (req, res) => {
	const code = req.query.code;
	if(!code) res.redirect('/');

	try {
		const params = {
			client_id: process.env.TWITCH_CLIENT_ID,
			client_secret: process.env.TWITCH_CLIENT_SECRET,
			redirect_uri: REDIRECT_URI,
			grant_type: 'authorization_code',
			code
		};
		const jwtRes = await axios.post(`https://id.twitch.tv/oauth2/token?${createQueryString(params)}`);
	
		if(jwtRes.status === 200) {
			const jwt = jwtRes.data;

			const decodedToken = jwt_decode(jwt.id_token);
			req.session.id = decodedToken.sub;
			res.cookie(AUTH_COOKIE, true);
			res.cookie(USERNAME_COOKIE, decodedToken.preferred_username);
			res.cookie(PICTURE_COOKIE, decodedToken.picture);
			res.redirect('/active-hunts');
		} else {
			console.log('error');
			console.log(jwtRes);
		}
	} catch(err) {
		console.log(err)
	}
});

router.get('/logout', (req, res) => {
	req.session = null;
	res.clearCookie('authenticated');
	res.clearCookie('username');
	res.clearCookie('picture_url');
	res.redirect('/');
});

export default router;

export function checkAuth(req, res, next) {
	if(!req.session.id) {
		res.redirect('/auth/logout');
		next('user invalid');
	}

	next();
}