import * as types from './_types';
import { SHINYDEX_URL } from '../../../shared/constants';
import axios from 'axios';
import axiosConfig from './axios-config';

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
		const shinydex = await axios.get(SHINYDEX_URL, axiosConfig);

		if(shinydex.status === 200) {
			dispatch(setShinydex(shinydex.data));
		} else if(shinydex.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}

export function postNewShinydexEntry(game, pokemon, notes, callback) {
	return async (dispatch) => {
		const newEntry = await axios.post(SHINYDEX_URL, {
			gameId: game.gameId,
			pokemon: pokemon.id,
			notes
		}, axiosConfig);

		if(newEntry.status === 200) {
			dispatch(addShinydexEntry(newEntry.data));
			typeof(callback) === 'function' && callback();
		} else if(newEntry.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}
	
export function putShinydexUpdate(id, gameId, pokemon, notes) {
	return async (dispatch) => {
		const updatedEntry = await axios.put(SHINYDEX_URL, {
			id,
			gameId,
			pokemon,
			notes
		}, axiosConfig);

		if(updatedEntry.status === 200) {
			dispatch(updateShinydexEntry(updatedEntry.data));
		} else if(updatedEntry.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}
	
export function deleteShinydexEntry(id) {
	return async (dispatch) => {
		const deleteEntry = await axios.delete(`${SHINYDEX_URL}/${id}`, axiosConfig);

		if(deleteEntry.status === 200) {
			dispatch(removeShinydexEntry(id));
		} else if(deleteEntry.status === 401) {
			window.location.href = '/twitchAuth/logout';
		}
	}
}