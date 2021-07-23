import React, { useEffect } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import { decodeToken, isExpired } from 'react-jwt';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from '../../constants';

import './auth-handler.scss';
import { clearUser } from '../../store/actions/user';

const AuthHandler = () => {
	const { hash } = useLocation();
	const [cookies, setCookie, removeCookie] = useCookies([AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE]);
	const dispatch = useDispatch();

	useEffect(() => {
		if(!hash) { window.location.href = '/'}
		
		const token = hash.substr(hash.indexOf('=') + 1);
		if(isExpired(token)) {
			removeCookie(AUTH_COOKIE);
			removeCookie(USERNAME_COOKIE)
			removeCookie(PICTURE_COOKIE);
			dispatch(clearUser());
			window.location.href = '/';
		}

		const decodedToken = decodeToken(token);
		if(decodedToken) {
			const { sub, preferred_username, picture } = decodedToken;
			setCookie(AUTH_COOKIE, sub);
			setCookie(USERNAME_COOKIE, preferred_username);
			setCookie(PICTURE_COOKIE, picture);
		
			window.location.replace('/hunts');
		}
	});

	return (
		<h2 className="auth-container">Logging in...</h2>
	)
}

export default AuthHandler;