import React, { useState } from 'react';
import TimeAgo from 'timeago-react';
import Modal from '../modal';

import PokemonViewer from '../pokemon-viewer';

import './focused-hunt-modal.scss';

import POKEMON_LIST from '../../static/data/pokemon-list';

const FocusedHuntModal = (props) => {
	const { hunt, isModifiable, close } = props;
	const [updatedCount, setUpdatedCount] = useState(-1);

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
			// TODO Dispatch request to update encounter number for this hunt
		}
		setUpdatedCount(-1);
	}

	function handleHuntInteract(action) {
		// TODO Handle increment/decrement operations
	}

	function handleDelete() {
		// TODO Prompt for confirmation before sending delete request
	}
	
	function handleHuntFinish() {

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
				) : (
					<button onClick={() => isModifiable && setUpdatedCount(hunt.encounters)}>{hunt.encounters.toLocaleString()}</button>
				)}
			</div>
			<div className="focused-hunt-display">
				{isModifiable && (
					<div className="focused-hunt-interactions">
						<button className="focused-hunt-decrement" onClick={() => handleHuntInteract('dec')}>-</button>
						<button className="focused-hunt-increment" onClick={() => handleHuntInteract('inc')}>+</button>
					</div>
				)}
				<div className="focused-hunt-detail">
					<label>Hunt started</label>
					<TimeAgo datetime={hunt.started} />
				</div>
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
				{isModifiable && <button className="focused-hunt-finish" onClick={handleHuntFinish}>Got it!</button>}
				<button className="focused-hunt-delete" onClick={handleDelete}>Delete</button>
			</div>
		</Modal>
	)
}

export default FocusedHuntModal;