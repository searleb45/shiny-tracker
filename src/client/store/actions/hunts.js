import * as types from './_types';
import { ACTIVE_HUNTS_URL, COMPLETED_HUNTS_URL } from '../../constants';
import axios from 'axios';

export function getActiveHunts(userId) {
	return async (dispatch) => {
		const hunts = await axios.get(ACTIVE_HUNTS_URL, { params: { id: userId } });
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