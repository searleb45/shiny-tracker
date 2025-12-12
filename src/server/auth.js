import express from 'express';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import db from './db';

import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from '../shared/constants';
const COOKIE_EXPIRATION = 1000 * 60 * 60 * 24 * 365;

const router = express.Router();

const REDIRECT_URI = `${process.env.TWITCH_CALLBACK_URL}/twitchAuth/callback`;
function createQueryString(params) {
	return Object.keys(params)
		.map((key) => `${key}=${encodeURIComponent(params[key])}`)
		.join('&');
}

// Twitch authentication handling
router.get('/', (req, res) => {
	// Check if auth request came from Pebble device
	const pblAcctId = req.query.pblAcctId;
	const fromPebble = !!pblAcctId;
	const params = {
		client_id: process.env.TWITCH_CLIENT_ID,
		redirect_uri: REDIRECT_URI,
		response_type: 'code',
		scope: 'openid',
		claims: JSON.stringify({'id_token': {picture: null, preferred_username: null}}),
		state: JSON.stringify({ source: fromPebble ? 'pebble' : 'web', id: fromPebble ? pblAcctId : undefined }),
	};

	
	res.redirect(`https://id.twitch.tv/oauth2/authorize?${createQueryString(params)}`);
	
});

router.get('/callback', async (req, res) => {
	const code = req.query.code;
	// Check if callback came from Pebble device
	const state = JSON.parse(req.query.state);
	const fromPebble = state?.source === 'pebble';
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
			// For Pebble users, save user ID in DB and associate with the Pebble account ID
			if (fromPebble) {
				const pblAcctId = state.id;
				await db.pebbleuser.upsert({
					pblAcctId: pblAcctId,
					twitchId: decodedToken.sub
				});
				// Success - no need to pass session to Pebble, they will pass the 
				// Pebble account ID as a header to associate an account ID
				// res.redirect('pebblejs://close#');
				res.send('<script>function done(){javascript:alert("Authentication successful! Press OK to close this window");window.location.href="pebblejs://close#";}done()</script>');
			} else {
				req.session.id = decodedToken.sub;
				res.cookie(AUTH_COOKIE, true, { maxAge: COOKIE_EXPIRATION });
				res.cookie(USERNAME_COOKIE, decodedToken.preferred_username, { maxAge: COOKIE_EXPIRATION });
				res.cookie(PICTURE_COOKIE, decodedToken.picture, { maxAge: COOKIE_EXPIRATION, encode: encodeURI });
				res.redirect('/active-hunts');
			}
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
	res.clearCookie(AUTH_COOKIE);
	res.clearCookie(USERNAME_COOKIE);
	res.clearCookie(PICTURE_COOKIE);
	res.redirect('/');
});

export default router;

export async function checkAuth(req, res, next) {
	// Pebble doesn't support session cookies, so we save the user ID server-side
	if (req.headers.pbl_acct_id) {
		const pblUser = await db.pebbleuser.findOne({
			where: {
				pblAcctId: req.headers.pbl_acct_id
			}
		});
		if (pblUser) {
			req.session.id = pblUser.twitchId;
		}
	}
	// Handle sessionless requests
	if(!req.session.id) {
		res.status(401).send();
		return;
	}

	next();
}