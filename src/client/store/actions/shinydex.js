import * as types from './_types';
import { SHINYDEX_URL } from '../../constants';
import axios from 'axios';

export function setShinydex(dex) {
	return {
		type: types.SET_SHINYDEX,
		shinydex: dex
	};
}

export function addShinydexEntry(entry) {
	return {
		type: types.ADD_NEW_SHINYDEX_ENTRY,
		newEntry: entry
	};
}

export function updateShinydexEntry(entry) {
	return {
		type: types.UPDATE_SHINYDEX_ENTRY,
		entry
	};
}

export function removeShinydexEntry(id) {
	return {
		type: types.REMOVE_SHINYDEX_ENTRY,
		id
	};
}

export function getShinydex() {
	return async (dispatch) => {
		const shinydex = await axios.get(SHINYDEX_URL);

		if(shinydex.status === 200) {
			dispatch(setShinydex(shinydex.data));
		}
	}
}

export function postNewShinydexEntry(game, pokemon, notes) {
	return async (dispatch) => {
		const newEntry = await axios.post(SHINYDEX_URL, {
			gameId: game.gameId,
			pokemon: pokemon.id,
			notes
		});

		if(newEntry.status === 200) {
			dispatch(addShinydexEntry(newEntry.data));
			typeof(callback) === 'function' && callback();
		}
	}
}
	
export function putShinydexUpdate(id, game, pokemon, notes) {
	return async (dispatch) => {
		const updatedEntry = await axios.put(SHINYDEX_URL, {
			id,
			game: game.gameId,
			pokemon: pokemon.id,
			notes
		});

		if(updatedEntry.status === 200) {
			dispatch(updateShinydexEntry(updatedEntry.data));
		}
	}
}
	
export function deleteShinydexEntry(id) {
	return async (dispatch) => {
		const deleteEntry = await axios.delete(`${SHINYDEX_URL}/${id}`);

		if(deleteEntry.status === 200) {
			dispatch(removeShinydexEntry(id));
		}
	}
}