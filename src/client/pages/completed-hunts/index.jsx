import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import HuntViewer from '../../components/hunt-viewer';
import FocusedHuntModal from '../../components/focused-hunt-modal';

import { getCompletedHunts } from '../../store/actions/hunts';

import './completed-hunts.scss';

const CompletedHunts = () => {
	const hunts = useSelector(state => state.hunts.completed);
	const focusedHunt = useSelector(state => state.hunts.focused);
	const dispatch = useDispatch();

	if(!hunts) {
		// Need to fetch shiny hunt list for user
		dispatch(getCompletedHunts());
		return <h2 className="loading-msg">Fetching your information...</h2>;
	}
	return (
		<>
			<main className="completed-hunts">
				<div className="interactions">
					TODO Add filters here
				</div>
				<div className="hunts-container">
					{hunts.map(hunt => <HuntViewer key={hunt.id} hunt={hunt} onClick={() => dispatch(setFocusedHunt(hunt.id))} />)}
				</div>
			</main>
			<FocusedHuntModal
				hunt={hunts.find((hunt) => hunt.id === focusedHunt)}
				isModifiable={false}
				close={() => dispatch(setFocusedHunt(-1))}
			/>
		</>
	);
}

export default CompletedHunts;