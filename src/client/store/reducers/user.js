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
		default:
			return state;
	}
}