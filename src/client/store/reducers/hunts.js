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
			const updateIndex = state.active.findIndex((hunt) => hunt.id === action.hunt.id);
			const newActiveList = [...state.active];
			newActiveList[updateIndex] = action.hunt;
			return {
				...state,
				active: newActiveList,
			};
		case types.QUICK_HUNT_UPDATE:
			const quickUpdateIndex = state.active.findIndex(hunt => hunt.id === action.id);
			localStorage.setItem('quickUpdateRevertCache', JSON.stringify(state.active[quickUpdateIndex]));
			const quickUpdateActiveList = [...state.active];
			quickUpdateActiveList[quickUpdateIndex].encounters = action.count;
			return {
				...state,
				active: quickUpdateActiveList,
				error: undefined
			};
		case types.REVERT_QUICK_HUNT_UPDATE:
			const cachedValue = JSON.parse(localStorage.getItem('quickUpdateRevertCache') || '{}');
			const revertUpdateIndex = state.active.findIndex(hunt => hunt.id === cachedValue.id);
			const revertUpdateActiveList = [...state.active];
			revertUpdateActiveList[revertUpdateIndex] = cachedValue;
			return {
				...state,
				active: revertUpdateActiveList,
				error: `Hunt update failed when setting ${action.action === 'complete' ? 'status to complete' : `count to ${action.count}`}`
			};
		case types.CLEAR_ERROR:
			return {
				...state,
				error: undefined
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