import * as types from './_types';

export function setUser(id, username, picture) {
	return {
		type: types.SET_USER,
		id,
		username,
		picture
	};
}