import * as types from '../actions/_types';
import initialState from "../initialState";

export default function shinyDexReducer(state = initialState.shinyDex, action) {
	switch(action.type) {
		case types.SET_SHINYDEX:
			return action.shinydex;
		case types.ADD_NEW_SHINYDEX_ENTRY:
			return [...state, action.newEntry];
		case types.UPDATE_SHINYDEX_ENTRY:
			return state.map((entry) => entry.id === action.entry.id ? action.entry : entry);
		case types.REMOVE_SHINYDEX_ENTRY:
			return state.filter((entry) => entry.id !== action.id);
		default:
			return state;
	}
};