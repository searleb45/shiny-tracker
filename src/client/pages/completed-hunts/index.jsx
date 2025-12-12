import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Select from 'react-select';

import BasePageTemplate from '../_base-template';

import HuntViewer from '../../components/hunt-viewer';
import FocusedHuntModal from '../../components/focused-hunt-modal';

import { getOddsForHunt } from '../../../shared/huntOddsCalc';

import { getCompletedHunts, setFocusedHunt } from '../../store/actions/hunts';

import POKEMON_GAMES from '../../../shared/data/pokemon-games.json';

import './completed-hunts.scss';
import { getPokemonById } from '../../../shared/dataLookup';

const SORT_OPTIONS = [
	{value: 'completionDate', label: 'Recently Completed'},
	{value: 'longestDuration', label: 'Longest Hunt'},
	{value: 'shortestDuration', label: 'Shortest Hunt'},
	{value: 'mostEncounters', label: 'Most Encounters'},
	{value: 'leastEncounters', label: 'Least Encounters'},
	{value: 'huntType', label: 'Hunt Type'},
	{value: 'bestOdds', label: 'Best Odds'},
	{value: 'worstOdds', label: 'Worst Odds'},
	{value: 'pokedexNumber', label: 'Pokédex Number'},
	{value: 'pokemonName', label: 'Pokémon Name'},
];

function sortHunts(hunts, sortMode) {
	let sortFunction = () => 0;
	switch(sortMode) {
		case 'completionDate':
			sortFunction = (a, b) => b.completionDate.localeCompare(a.completionDate);
			break;
		case 'longestDuration':
			sortFunction = (a, b) => (new Date(b.completionDate) - new Date(b.started)) - (new Date(a.completionDate) - new Date(a.started))
			break;
		case 'shortestDuration':
			sortFunction = (a, b) => (new Date(a.completionDate) - new Date(a.started)) - (new Date(b.completionDate) - new Date(b.started))
			break;
		case 'mostEncounters':
			sortFunction = (a, b) => b.encounters - a.encounters;
			break;
		case 'leastEncounters':
			sortFunction = (a, b) => a.encounters - b.encounters;
			break;
		case 'huntType':
			sortFunction = (a, b) => a.huntType.localeCompare(b.huntType);
			break;
		case 'bestOdds':
			sortFunction = (a, b) => {
				const aOdds = getOddsForHunt(a);
				const bOdds = getOddsForHunt(b);
				const aOddsDec = parseInt(aOdds.split('/')[0]) / parseInt(aOdds.split('/')[1]);
				const bOddsDec = parseInt(bOdds.split('/')[0]) / parseInt(bOdds.split('/')[1]);
				return bOddsDec - aOddsDec;
			};
			break;
		case 'worstOdds':
			sortFunction = (a, b) => {
				const aOdds = getOddsForHunt(a);
				const bOdds = getOddsForHunt(b);
				const aOddsDec = parseInt(aOdds.split('/')[0]) / parseInt(aOdds.split('/')[1]);
				const bOddsDec = parseInt(bOdds.split('/')[0]) / parseInt(bOdds.split('/')[1]);
				return aOddsDec - bOddsDec;
			};
			break;
		case 'pokedexNumber':
			sortFunction = (a, b) => a.pokemon - b.pokemon;
			break;
		case 'pokemonName':
			sortFunction = (a, b) => getPokemonById(a.pokemon).name.localeCompare(getPokemonById(b.pokemon).name);
			break;
	}

	return hunts.sort(sortFunction);
}

function filterHunts(hunts, filterString) {
	const regex = new RegExp(filterString, 'i');
	return hunts.filter((hunt) => {
		const game = POKEMON_GAMES.find((game) => game.gameId === hunt.gameId);
		const pokemon = getPokemonById(hunt.pokemon);

		return regex.test(pokemon.name)
			|| regex.test(game.name.replace('é', 'e'))
			|| regex.test(hunt.huntType);
	});
}

const CompletedHunts = () => {
	const [sort, setSort] = useState(SORT_OPTIONS[0].value);
	const [filterString, setFilterString] = useState('');
	const hunts = useSelector(state => state.hunts.completed);
	const focusedHunt = useSelector(state => state.hunts.focused);
	const dispatch = useDispatch();
	
	useEffect(() => {
		dispatch(getCompletedHunts());
	}, [])

	if(!hunts) {
		return <h2 className="loading-msg">Fetching your information...</h2>;
	}

	const displayHunts = sortHunts(filterHunts(hunts, filterString), sort);

	return (
		<>
			<BasePageTemplate
				className="completed-hunts"
				header={
					<>
						<input className="filter" type="text" value={filterString} onChange={(e) => setFilterString(e.target.value)} placeholder="Filter Hunts" />
						<label className="sort-label">Sort by:</label>
						<Select classNamePrefix="react-select" isSearchable={false} className="react-select sort" options={SORT_OPTIONS} value={SORT_OPTIONS.find(opt => opt.value === sort)} onChange={opt => setSort(opt.value)} />
					</>
				}
				page={
					<>
						{displayHunts.map(hunt => <HuntViewer key={hunt.id} hunt={hunt} onClick={() => dispatch(setFocusedHunt(hunt.id))} />)}
					</>
				}
			/>
			<FocusedHuntModal
				hunt={hunts.find((hunt) => hunt.id === focusedHunt)}
				isModifiable={false}
				close={() => dispatch(setFocusedHunt(-1))}
			/>
		</>
	);
}

export default CompletedHunts;