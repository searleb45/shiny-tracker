import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TimeAgo from 'timeago-react';
import { Online } from 'react-detect-offline';

import { putHuntUpdate, deleteHunt, clearError } from '../../store/actions/hunts';

import calculateOdds from '../../huntOddsCalc';

import Modal from '../modal';
import ErrorBanner from '../banner';
import PokemonViewer from '../pokemon-viewer';

import './focused-hunt-modal.scss';

import POKEMON_LIST from '../../static/data/pokemon-list';
import GAME_LIST from '../../static/data/pokemon-games.json';
import HUNT_LIST from '../../static/data/hunt-types.json';

function getOddsForHunt(hunt) {
	if(hunt.isStaticOdds) {
		return hunt.odds;
	}
	const generation = GAME_LIST.find(game => game.gameId === hunt.gameId).generation;
	const huntData = HUNT_LIST.find(huntEntry => huntEntry.generations.includes(generation) && huntEntry.id === hunt.huntType);

	return calculateOdds(huntData, hunt);
}

const FocusedHuntModal = (props) => {
	const { hunt, isModifiable, close } = props;
	const [updatedCount, setUpdatedCount] = useState(-1);
	const updateError = useSelector(state => state.hunts.error);
	const dispatch = useDispatch();

	if(!hunt) return null;

	const pokemon = POKEMON_LIST.find((pkmn) => pkmn.id === hunt.pokemon);
	
	const oddsString = getOddsForHunt(hunt);
	const odds = parseInt(oddsString.split('/')[0]) / parseInt(oddsString.split('/')[1]);
	const partialDist = Math.pow(1-odds, hunt.encounters);
	const finalDist = 100 * (partialDist * Math.pow(-(1 / (odds - 1)), hunt.encounters) - partialDist);

	const encountersTo90 = Math.ceil(Math.log(.1) / Math.log(1 - odds)) - hunt.encounters;

	function onModalClose() {
		setUpdatedCount(-1);
		dispatch(clearError());
		typeof(close) === 'function' && close();
	}

	function updateHuntCount(newCount, e) {
		if(e) e.preventDefault();
		if(newCount !== hunt.encounters) {
			dispatch(putHuntUpdate(hunt.id, 'setCount', parseInt(newCount)));
		}
		setUpdatedCount(-1);
	}

	function handleHuntInteract(action) {
		window.navigator.vibrate(50);
		switch(action) {
			case 'inc':
				updateHuntCount(hunt.encounters + 1);
				break;
			case 'dec':
				updateHuntCount(Math.max(hunt.encounters - 1, 0));
				break;
		}
	}

	function handleComplete() {
		const confirmComplete = confirm('Are you sure you want to finish this shiny hunt? (This will also add an entry for this Pokémon to your Shinydex)');
		
		if(confirmComplete) {
			const date = new Date().toLocaleDateString();
			const game = GAME_LIST.find(game => game.gameId === hunt.gameId);
			const gameName = game.name.replace('Pokémon ', '');
			const huntName = HUNT_LIST.find(huntEntry => hunt.huntType === huntEntry.id || hunt.huntType === huntEntry.name).name;
			const completionString = `Shiny hunt in ${gameName} via ${huntName} - Completed ${date} after ${hunt.encounters.toLocaleString()} encounters`;
			dispatch(putHuntUpdate(hunt.id, 'complete', hunt.encounters, completionString));
		}
	}

	function handleDelete() {
		const confirmDelete = confirm('Are you sure you want to delete this hunt? This cannot be undone!');

		if(confirmDelete) {
			dispatch(deleteHunt(hunt.id));
		}
	}

	let subtitle = !hunt.completed && hunt.lastUpdated ? `Last updated ${new Date(hunt.lastUpdated).toLocaleString()}` : '';

	return (
		<Modal isOpen={!!hunt} close={onModalClose} modalName={pokemon.name} modalSubTitle={subtitle} containerClassName="focused-hunt-modal">
			<ErrorBanner message={updateError} onClose={() => dispatch(clearError())} />
			<div className="focused-hunt-pokemon-view">
				<PokemonViewer pokemonId={hunt.pokemon} gameId={hunt.gameId} />
			</div>
			<div className="focused-hunt-counter">
				{updatedCount > -1 ? (
					<form onSubmit={(e) => updateHuntCount(updatedCount, e)}>
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
					<>
						<div className="focused-hunt-detail">
							<label>Hunt started</label>
							<TimeAgo datetime={hunt.started} />
						</div>
					</>
				)}
				<div className="focused-hunt-detail">
					<label>Odds</label>
					{oddsString}
				</div>
				<div className="focused-hunt-detail">
					<label>Aggregate shiny chance</label>
					{finalDist.toFixed(2)}%
				</div>
				<div className="focused-hunt-detail">
					<label>Encounters until 90%</label>
					{encountersTo90.toLocaleString()}
				</div>
				<div className="focused-hunt-final-interactions">
					{isModifiable && <button className="focused-hunt-finish" onClick={handleComplete}>Got it!</button>}
					<Online polling={{enabled: false}}><button className="focused-hunt-delete" onClick={handleDelete}>Delete</button></Online>
				</div>
			</div>
		</Modal>
	)
}

export default FocusedHuntModal;