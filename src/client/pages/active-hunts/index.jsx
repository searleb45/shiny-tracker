import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Online } from 'react-detect-offline';
import NewHuntModal from '../../components/new-hunt-modal';
import FocusedHuntModal from '../../components/focused-hunt-modal';
import { getActiveHunts, setFocusedHunt } from '../../store/actions/hunts';
import HuntViewer from '../../components/hunt-viewer';

import BasePageTemplate from '../_base-template';

import './active-hunts.scss';

const ActiveHunts = () => {
	const hunts = useSelector(state => state.hunts.active);
	const [newHuntModalOpen, setNewHuntModalOpen] = useState(false);
	const focusedHunt = useSelector(state => state.hunts.focused);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getActiveHunts());
		
		const updateInterval = setInterval(() => {
			dispatch(getActiveHunts());
		}, 1000 * 60 * 30);

		return () => {
			clearInterval(updateInterval);
		}
	}, [])

	if(!hunts) {
		return <h2 className="loading-msg">Fetching your information...</h2>;
	}
	return (
		<>
			<BasePageTemplate
				className="active-hunts"
				header={
					<Online polling={{enabled: false}}>
						<button className="btn-primary add-hunt" onClick={() => setNewHuntModalOpen(true)}>
							<span className="plus-icon"></span>
							<span className="button-text">Create New Hunt</span>
						</button>
					</Online>
				}
				page={
					<>
						{hunts.map(hunt => <HuntViewer key={hunt.id} hunt={hunt} onClick={() => dispatch(setFocusedHunt(hunt.id))} />)}
					</>
				}
			/>
			<NewHuntModal
				isOpen={newHuntModalOpen}
				close={() => setNewHuntModalOpen(false)}
			/>
			<FocusedHuntModal
				hunt={hunts.find((hunt) => hunt.id === focusedHunt)}
				isModifiable={true}
				close={() => dispatch(setFocusedHunt(-1))}
			/>
		</>
	);
};

export default ActiveHunts;