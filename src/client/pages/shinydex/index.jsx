import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BasePageTemplate from '../_base-template';

import GameSelect from '../../components/game-select';
import ShinyDexEntry from '../../components/shinydex-entry';
import AddShinydexEntryModal from '../../components/add-shinydex-entry-modal';

import POKEMON_LIST from '../../static/data/pokemon-list';

import './shinydex.scss';
import { getShinydex } from '../../store/actions/shinydex';
import ShinydexDetailModal from '../../components/shinydex-detail-modal';

function applyFilters(shinydex, pokemonFilter, gameFilter, obtainedOnlyFilter) {
	let filteredList = POKEMON_LIST;
	if(pokemonFilter) {
		const regex = new RegExp(pokemonFilter, 'i');
		filteredList = filteredList.filter((pkmn) => regex.test(pkmn.name));
	}
	if(gameFilter) {
		filteredList = filteredList.filter((pkmn) => {
			return shinydex.reduce((acc, dexEntry) => acc || (dexEntry.pokemon === pkmn.id && dexEntry.gameId === gameFilter.gameId), false);
		});
	}
	if(obtainedOnlyFilter) {
		filteredList = filteredList.filter((pkmn) => {
			return shinydex.some((dexEntry) => dexEntry.pokemon === pkmn.id);
		});
	}

	return filteredList;
}

const Shinydex = () => {
	const shinydex = useSelector(state => state.shinyDex);
	const [pokemonFilter, setPokemonFilter] = useState('');
	const [gameFilter, setGameFilter] = useState(null);
	const [showObtainedOnly, setShowObtainedOnly] = useState(false);
	const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);
	const [focusedEntry, setFocusedEntry] = useState(-1);
	const dispatch = useDispatch();

	if(!shinydex) {
		dispatch(getShinydex());
		return <h2>Loading your information...</h2>
	}

	const handleGameChange = (game) => {
		if(game != null) {
			setShowObtainedOnly(true);
		}
		setGameFilter(game);
	};

	const handleObtainedCheckbox = (val) => {
		setShowObtainedOnly(val);
		setGameFilter(null);
	};

	const filteredDexList = applyFilters(shinydex, pokemonFilter, gameFilter, showObtainedOnly);
	const numObtained = POKEMON_LIST.reduce((acc, pkmn) => {
		return shinydex.some(entry => entry.pokemon === pkmn.id) ? acc + 1 : acc;
	}, 0);

	return (
		<>
			<BasePageTemplate
				className="shinydex"
				header={<>
					<input type="text" className="shinydex-pokemon-filter" placeholder="Filter Pokémon" value={pokemonFilter} onChange={(e) => setPokemonFilter(e.target.value)} />
					<GameSelect id="shinydex-game-filter" placeholder="Filter Games" isSearchable={false} isClearable={true} useStorageGames={true} value={gameFilter} onChange={(opt) => handleGameChange(opt)} />
					<label htmlFor="shinydex-obtained-filter">
						<input id="shinydex-obtained-filter" type="checkbox" checked={showObtainedOnly} onChange={(e) => handleObtainedCheckbox(e.target.checked)} />
						Show obtained Pokémon only
					</label>
					<button className="btn-primary add-shinydex-entry" onClick={() => setAddEntryModalOpen(true)}>Add New Entry</button>
				</>}
				page={
					<>
						<div className="shinydex-metadata">
							{pokemonFilter || gameFilter || showObtainedOnly ? <h4>Showing {filteredDexList.length} Pokémon</h4> : null}
							<h4>Obtained {numObtained} of {POKEMON_LIST.length} | {shinydex.length} entr{shinydex.length === 1 ? 'y' : 'ies'} total</h4>
						</div>
						{filteredDexList.map(pkmn => <ShinyDexEntry key={pkmn.id} pokemon={pkmn} collected={shinydex.some(entry => entry.pokemon === pkmn.id)} onClick={() => setFocusedEntry(pkmn.id)} />)}
					</>
				}
			/>
			<AddShinydexEntryModal
				isOpen={addEntryModalOpen}
				close={() => setAddEntryModalOpen(false)}
			/>
			<ShinydexDetailModal
				close={() => setFocusedEntry(null)}
				pokemon={POKEMON_LIST.find(pkmn => pkmn.id === focusedEntry)}
				entries={(shinydex || []).filter(entry => entry.pokemon === focusedEntry)}
			/>
		</>
	)
};

export default Shinydex;