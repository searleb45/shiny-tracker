import * as types from './_types';
import { ACTIVE_HUNTS_URL, COMPLETED_HUNTS_URL } from '../../constants';
import axios from 'axios';

export function setActiveHunts(hunts) {
	return {
		type: types.SET_ACTIVE_HUNTS,
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

export function getActiveHunts() {
	return async (dispatch) => {
		const hunts = await axios.get(ACTIVE_HUNTS_URL);
		if(hunts.status === 200) {
			dispatch(setActiveHunts(hunts.data));
		}
	}
}

export function postNewHunt(game, pokemon, huntType, odds, callback) {
	return async (dispatch) => {
		const newHunt = await axios.post(ACTIVE_HUNTS_URL, {
			gameId: game.gameId,
			pokemon: pokemon.id,
			huntType: huntType.name,
			odds
		});

		if(newHunt.status === 200) {
			dispatch(addNewHunt(newHunt.data));
			typeof(callback) === 'function' && callback();
		}
	}
}

export function putHuntUpdate(id, action, count) {
	return async (dispatch) => {
		const updatedHunt = await axios.put(ACTIVE_HUNTS_URL, {
			id,
			op: action,
			val: count
		});

		if(updatedHunt.status === 200) {
			if(action === 'complete') {
				dispatch(removeHunt(updatedHunt.data));
				dispatch(addCompletedHunt(updatedHunt.data));
			} else {
				dispatch(updateHunt(updatedHunt.data));
			}
		}
	}
}

export function deleteHunt(id) {
	return async (dispatch) => {
		const deleteHunt = await axios.delete(`${ACTIVE_HUNTS_URL}/${id}`);

		if(deleteHunt.status === 200) {
			dispatch(removeHunt({id}));
		}
	}
}