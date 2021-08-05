import * as types from '../actions/_types';
import initialState from '../initialState';

export default function userReducer(state = initialState.user, action) {
	switch(action.type) {
		case types.SET_USER:
			return {
				...state,
				authenticated: true,
				username: action.username,
				picture: action.picture
			};
		case types.CLEAR_USER:
			return {
				...state,
				authenticated: false,
				username: undefined,
				picture: undefined
			};
		case types.SET_DARK_MODE_PREFERENCE:
			localStorage.setItem('darkModePreference', action.enabled);
			if(action.enabled) document.body.classList.add('dark');
			else document.body.classList.remove('dark');
			return {
				...state,
				darkMode: action.enabled
			};
		default:
			return state;
	}
}