import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NewHuntModal from '../../components/new-hunt-modal';
import { getActiveHunts } from '../../store/actions/hunts';
import HuntViewer from '../../components/hunt-viewer';

import './active-hunts.scss';

const ActiveHunts = () => {
	const hunts = useSelector(state => state.hunts.activeHunts);
	const [newHuntModalOpen, setNewHuntModalOpen] = useState(false);
	const dispatch = useDispatch();

	if(!hunts) {
		// Need to fetch shiny hunt list for user
		dispatch(getActiveHunts());
		return <h2 className="loading-msg">Fetching your information...</h2>;
	}
	return (
		<>
			<main className="active-hunts">
				<div className="interactions">
					<button className="btn-primary add-hunt" onClick={() => setNewHuntModalOpen(true)}>
						<span className="plus-icon"></span>
						<span className="button-text">Create New Hunt</span>
					</button>
				</div>
				<div className="hunts-container">
					{hunts.map(hunt => <HuntViewer key={hunt.id} hunt={hunt} />)}
				</div>
			</main>
			<NewHuntModal
				isOpen={newHuntModalOpen}
				close={() => setNewHuntModalOpen(false)}
			/>
		</>
	);
};

export default ActiveHunts;