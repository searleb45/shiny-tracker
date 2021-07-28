import * as types from './_types';
import { ACTIVE_HUNTS_URL, COMPLETED_HUNTS_URL } from '../../constants';
import axios from 'axios';

export function getActiveHunts() {
	return async (dispatch) => {
		const hunts = await axios.get(ACTIVE_HUNTS_URL);
		if(hunts.status === 200) {
			dispatch(setActiveHunts(hunts.data));
		}
	}
}

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