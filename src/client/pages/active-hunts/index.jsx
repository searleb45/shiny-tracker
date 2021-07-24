import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getActiveHunts } from '../../store/actions/hunts';

import './active-hunts.scss';

const ActiveHunts = () => {
	const hunts = useSelector(state => state.hunts.activeHunts);
	const userId = useSelector(state => state.user.id);
	const dispatch = useDispatch();

	if(!hunts) {
		// Need to fetch shiny hunt list for user
		dispatch(getActiveHunts(userId));
		return <h2 className="loading-msg">Fetching your information...</h2>;
	}
	return (
		<main className="active-hunts">
			<div className="interactions">
				<button className="add-hunt">
					<span className="plus-icon">+</span>
					<span className="button-text">Create New Hunt</span>
				</button>
			</div>
			<div className="hunts-container">
				{JSON.stringify(hunts)}
			</div>
		</main>
	);
};

export default ActiveHunts;