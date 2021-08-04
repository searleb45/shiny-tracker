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
		case types.UPDATE_HUNT:
			const index = state.active.findIndex((hunt) => hunt.id === action.hunt.id);
			const newActiveList = [...state.active];
			newActiveList[index] = action.hunt;
			return {
				...state,
				active: newActiveList
			};
		case types.REMOVE_HUNT:
			return {
				...state,
				active: state.active.filter((hunt) => hunt.id !== action.hunt.id),
				completed: state.completed && state.completed.filter((hunt) => hunt.id !== action.hunt.id),
				focused: state.focused === action.hunt.id ? -1 : state.focused
			};
		case types.SET_COMPLETED_HUNTS:
			return {
				...state,
				completed: action.hunts
			};
		case types.ADD_COMPLETED_HUNT:
			return {
				...state,
				completed: state.completed !== undefined ? [...state.completed, action.hunt] : undefined
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