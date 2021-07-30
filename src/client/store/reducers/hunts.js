import * as types from '../actions/_types';
import initialState from "../initialState";

export default function huntsReducer(state = initialState.hunts, action) {
	switch(action.type) {
		case types.SET_ACTIVE_HUNTS:
			return {
				...state,
				active: action.hunts
			};
		case types.ADD_NEW_HUNT:
			return {
				...state,
				active: [...state.active, action.hunt]
			};
		case types.SET_FOCUSED_HUNT:
			return {
				...state,
				focused: action.hunt
			};
		default:
			return state;
	}
}