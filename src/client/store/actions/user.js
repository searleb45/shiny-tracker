import * as types from './_types';
import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from '../../constants';
import CookieHelper from 'cookie-helper';

export function setUser(id, username, picture) {
	return {
		type: types.SET_USER,
		id,
		username,
		picture
	};
};

export function clearUser() {
	return {
		type: types.CLEAR_USER
	};
};

export function setDarkModePreference(enabled) {
	return {
		type: types.SET_DARK_MODE_PREFERENCE,
		enabled
	};
};

export function logout() {
	return (dispatch) => {
		CookieHelper.erase(AUTH_COOKIE);
		CookieHelper.erase(PICTURE_COOKIE);
		CookieHelper.erase(USERNAME_COOKIE);
		dispatch(clearUser());
		window.location.href = '/';
	}
};