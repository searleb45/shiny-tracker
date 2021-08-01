import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import TimeAgo from 'timeago-react';

import { putHuntUpdate, deleteHunt } from '../../store/actions/hunts';

import Modal from '../modal';
import PokemonViewer from '../pokemon-viewer';

import './focused-hunt-modal.scss';

import POKEMON_LIST from '../../static/data/pokemon-list';

const FocusedHuntModal = (props) => {
	const { hunt, isModifiable, close } = props;
	const [updatedCount, setUpdatedCount] = useState(-1);
	const dispatch = useDispatch();

	if(!hunt) return null;

	const pokemon = POKEMON_LIST.find((pkmn) => pkmn.id === hunt.pokemon);
		
	const odds = parseInt(hunt.odds.split('/')[0]) / parseInt(hunt.odds.split('/')[1]);
	const partialDist = Math.pow(1-odds, hunt.encounters);
	const finalDist = 100 * (partialDist * Math.pow(-(1 / (odds - 1)), hunt.encounters) - partialDist);

	const encountersTo90 = Math.ceil(Math.log(.1) / Math.log(1 - odds)) - hunt.encounters;

	function onModalClose() {
		setUpdatedCount(-1);
		typeof(close) === 'function' && close();
	}

	function updateHuntCount(newCount) {
		if(newCount !== hunt.encounters) {
			dispatch(putHuntUpdate(hunt.id, 'setCount', parseInt(newCount)));
		}
		setUpdatedCount(-1);
	}

	function handleHuntInteract(action) {
		window.navigator.vibrate(50);
		dispatch(putHuntUpdate(hunt.id, action));
	}

	function handleDelete() {
		const confirmDelete = confirm('Are you sure you want to delete this hunt? This cannot be undone!');

		if(confirmDelete) {
			dispatch(deleteHunt(hunt.id));
		}
	}

	return (
		<Modal isOpen={!!hunt} close={onModalClose} modalName={pokemon.name} containerClassName="focused-hunt-modal">
			<div className="focused-hunt-pokemon-view">
				<PokemonViewer pokemonId={hunt.pokemon} gameId={hunt.gameId} />
			</div>
			<div className="focused-hunt-counter">
				{updatedCount > -1 ? (
					<form onSubmit={() => updateHuntCount(updatedCount)}>
						<input
							type="number"
							autoFocus
							value={updatedCount}
							onChange={(e) => setUpdatedCount(e.target.value)}
							onBlur={() => updateHuntCount(updatedCount)} />
					</form>
				) : isModifiable ? (
					<button onClick={() => setUpdatedCount(hunt.encounters)}>{hunt.encounters.toLocaleString()}</button>
					) : hunt.encounters.toLocaleString()
				}
			</div>
			<div className="focused-hunt-display">
				{isModifiable && (
					<div className="focused-hunt-interactions">
						<button className="focused-hunt-decrement" onClick={() => handleHuntInteract('dec')}>-</button>
						<button className="focused-hunt-increment" onClick={() => handleHuntInteract('inc')}>+</button>
					</div>
				)}
				{hunt.completed ? (
					<>
						<div className="focused-hunt-detail">
							<label>Hunt started</label>
							{new Date(hunt.started).toLocaleDateString()}
						</div>
						<div className="focused-hunt-detail">
							<label>Hunt finished</label>
							{new Date(hunt.completionDate).toLocaleDateString()}
						</div>
					</>
				) : (
					<div className="focused-hunt-detail">
						<label>Hunt started</label>
						<TimeAgo datetime={hunt.started} />
					</div>
				)}
				<div className="focused-hunt-detail">
					<label>Odds</label>
					{hunt.odds}
				</div>
				<div className="focused-hunt-detail">
					<label>Binomial distribution</label>
					{finalDist.toFixed(2)}%
				</div>
				<div className="focused-hunt-detail">
					<label>Encounters until 90%</label>
					{encountersTo90.toLocaleString()}
				</div>
				<div className="focused-hunt-final-interactions">
					{isModifiable && <button className="focused-hunt-finish" onClick={() => handleHuntInteract('complete')}>Got it!</button>}
					<button className="focused-hunt-delete" onClick={handleDelete}>Delete</button>
				</div>
			</div>
		</Modal>
	)
}

export default FocusedHuntModal;