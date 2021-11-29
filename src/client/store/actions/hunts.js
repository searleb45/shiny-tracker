import * as types from './_types';
import { ACTIVE_HUNTS_URL, COMPLETED_HUNTS_URL } from '../../constants';
import axios from 'axios';
import axiosConfig from './axios-config';

export function setActiveHunts(hunts) {
	return {
		type: types.SET_ACTIVE_HUNTS,
		hunts
	};
}

export function setCompletedHunts(hunts) {
	return {
		type: types.SET_COMPLETED_HUNTS,
		hunts
	};
}

export function addNewHunt(hunt) {
	return {
		type: types.ADD_NEW_HUNT,
		hunt
	};
}

export function updateHunt(hunt) {
	return {
		type: types.UPDATE_HUNT,
		hunt
	};
}

export function removeHunt(hunt) {
	return {
		type: types.REMOVE_HUNT,
		hunt
	}
};

export function addCompletedHunt(hunt) {
	return {
		type: types.ADD_COMPLETED_HUNT,
		hunt
	}
};

export function setFocusedHunt(hunt) {
	return {
		type: types.SET_FOCUSED_HUNT,
		hunt
	}
}

export function quickHuntUpdate(id, count) {
	return {
		type: types.QUICK_HUNT_UPDATE,
		id,
		count
	};
}

export function revertQuickHuntUpdate(count, action) {
	return {
		type: types.REVERT_QUICK_HUNT_UPDATE,
		count,
		action
	};
}

export function clearError() {
	return {
		type: types.CLEAR_ERROR
	};
}

export function getActiveHunts() {
	return async (dispatch) => {
		const hunts = await axios.get(ACTIVE_HUNTS_URL, axiosConfig);
		if(hunts.status === 200) {
			dispatch(setActiveHunts(hunts.data));
		} else if(hunts.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}

export function postNewHunt(game, pokemon, huntType, hasShinyCharm, hasLure, callback) {
	return async (dispatch) => {
		const newHunt = await axios.post(ACTIVE_HUNTS_URL, {
			gameId: game.gameId,
			pokemon: pokemon.id,
			huntType: huntType.id,
			hasShinyCharm,
			hasLure
		}, axiosConfig);

		if(newHunt.status === 200) {
			dispatch(addNewHunt(newHunt.data));
			typeof(callback) === 'function' && callback();
		} else if(newHunt.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}

export function putHuntUpdate(id, action, count, completionString) {
	return async (dispatch) => {
		if(action === 'setCount') {
			dispatch(quickHuntUpdate(id, count));
		}
		try {
			const updatedHunt = await axios.put(ACTIVE_HUNTS_URL, {
				id,
				op: action,
				val: count,
				str: completionString
			}, axiosConfig);
	
			if(updatedHunt.status === 200) {
				if(action === 'complete') {
					dispatch(removeHunt(updatedHunt.data));
					dispatch(addCompletedHunt(updatedHunt.data));
				} else {
					dispatch(updateHunt(updatedHunt.data));
				}
			} else if(updatedHunt.status === 401) {
				window.location.href = '/twitchAuth/logout';
			} else {
				dispatch(revertQuickHuntUpdate(count, action));
			}
		} catch(err) {
			console.error(err);
			dispatch(revertQuickHuntUpdate(count, action));
		}
	}
}

export function deleteHunt(id) {
	return async (dispatch) => {
		const deleteHunt = await axios.delete(`${ACTIVE_HUNTS_URL}/${id}`, axiosConfig);

		if(deleteHunt.status === 200) {
			dispatch(removeHunt({id}));
		} else if(deleteHunt.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}

export function getCompletedHunts() {
	return async (dispatch) => {
		const hunts = await axios.get(COMPLETED_HUNTS_URL, axiosConfig);
		if(hunts.status === 200) {
			dispatch(setCompletedHunts(hunts.data));
		} else if(hunts.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}