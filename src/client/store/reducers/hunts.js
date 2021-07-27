import * as types from '../actions/_types';
import initialState from "../initialState";

export default function huntsReducer(state = initialState.hunts, action) {
	switch(action.type) {
		case types.SET_ACTIVE_HUNTS:
			return {
				...state,
				activeHunts: action.hunts
			};
		case types.ADD_NEW_HUNT:
			return {
				...state,
				activeHunts: [...state.activeHunts, action.hunt]
			};
		default:
			return state;
	}
}