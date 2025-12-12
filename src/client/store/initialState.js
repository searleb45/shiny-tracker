import { AUTH_COOKIE, USERNAME_COOKIE, PICTURE_COOKIE } from "../../shared/constants";
import CookieHelper from 'cookie-helper';

export default {
	user: {
		authenticated: CookieHelper.read(AUTH_COOKIE) !== null,
		username: CookieHelper.read(USERNAME_COOKIE),
		picture: decodeURI(CookieHelper.read(PICTURE_COOKIE)),
		darkMode: localStorage.getItem('darkModePreference') ? JSON.parse(localStorage.getItem('darkModePreference')) : window.matchMedia('(prefers-color-scheme: dark)').matches
	},
	hunts: {
		active: undefined,
		completed: undefined,
		focused: -1,
		error: undefined
	},
	shinyDex: null,
	serviceWorkerEnabled: false
};