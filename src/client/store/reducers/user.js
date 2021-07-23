import * as types from '../actions/_types';
import initialState from '../initialState';

export default function userReducer(state = initialState.user, action) {
	switch(action.type) {
		case types.SET_USER:
			return {
				...state,
				id: action.id,
				username: action.username,
				picture: action.picture
			};
		case types.CLEAR_USER:
			return {
				...state,
				id: undefined,
				username: undefined,
				picture: undefined
			}
		default:
			return state;
	}
}