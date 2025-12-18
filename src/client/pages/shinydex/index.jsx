import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import BasePageTemplate from '../_base-template';

import GameSelect from '../../components/game-select';
import AddShinydexEntryModal from '../../components/add-shinydex-entry-modal';
import ShinyStatsModal from '../../components/shiny-stats-modal';

import POKEMON_LIST from '../../../shared/data/pokemon-list';

import './shinydex.scss';
import { getShinydex } from '../../store/actions/shinydex';
import ShinyDexList from '../../components/shinydex-list';
import ShinydexDetailModal from '../../components/shinydex-detail-modal';
import { getPokemonById } from '../../../shared/dataLookup';

const NUM_OBTAINABLE = POKEMON_LIST.filter((pkmn) => !pkmn.shinyLocked).length - 1;

function applyFilters(shinydex, pokemonFilter, gameFilter, obtainedOnlyFilter, unobtainedOnlyFilter,includeEvolutions) {
	let filteredList = POKEMON_LIST.filter((pkmn) => pkmn.id !== 0); // Always filter out the "Any" entry
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
	if(unobtainedOnlyFilter) {
		filteredList = filteredList.filter((pkmn) => {
			return !shinydex.some((dexEntry) => dexEntry.pokemon === pkmn.id);
		});
	}
	if(pokemonFilter) {
		const regex = new RegExp(pokemonFilter, 'i');
		filteredList = filteredList.filter((pkmn) => regex.test(pkmn.name));

		if(includeEvolutions) {
			const idSet = new Set();
			filteredList.forEach((pkmn) => {
				idSet.add(pkmn.id);
				pkmn.evolutions.forEach((evo) => idSet.add(evo));
			});

			filteredList = [...idSet].sort((a,b) => a-b).map((id) => getPokemonById(id));
		}
	}

	return filteredList;
}

const Shinydex = () => {
	const shinydex = useSelector(state => state.shinyDex);
	const [pokemonFilter, setPokemonFilter] = useState('');
	const [gameFilter, setGameFilter] = useState(null);
	const [showObtainedOnly, setShowObtainedOnly] = useState(false);
	const [showUnobtainedOnly, setShowUnobtainedOnly] = useState(false);
	const [includeEvolutions, setIncludeEvolutions] = useState(false);
	const [addEntryModalOpen, setAddEntryModalOpen] = useState(false);
	const [focusedEntry, setFocusedEntry] = useState(-1);
	const [showShinyStats, setShowShinyStats] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getShinydex());
	}, []);

	if(!shinydex) {
		return <h2 className="loading-msg">Loading your information...</h2>
	}

	const handleGameChange = (game) => {
		if(game != null) {
			setShowObtainedOnly(true);
			setShowUnobtainedOnly(false);
		}
		setGameFilter(game);
	};

	const handleObtainedCheckbox = (val) => {
		setShowObtainedOnly(val);
		setShowUnobtainedOnly(false);
		setGameFilter(null);
	};

	const handleUnobtainedCheckbox = (val) => {
		setShowUnobtainedOnly(val);
		setShowObtainedOnly(false);
		setGameFilter(null);
	};

	const shinyStatLinkClick = (e) => {
		e.preventDefault();
		setShowShinyStats(true);
	}

	const filteredDexList = applyFilters(shinydex, pokemonFilter, gameFilter, showObtainedOnly, showUnobtainedOnly, includeEvolutions);
	const numObtained = POKEMON_LIST.reduce((acc, pkmn) => {
		return shinydex.some(entry => entry.pokemon === pkmn.id) ? acc + 1 : acc;
	}, 0);

	return (
		<>
			<BasePageTemplate
				className="shinydex"
				header={<>
					<input type="text" className="shinydex-pokemon-filter" placeholder="Filter Pokémon" value={pokemonFilter} onChange={(e) => setPokemonFilter(e.target.value)} onBlur={() => !pokemonFilter && setIncludeEvolutions(false)} />
					<GameSelect id="shinydex-game-filter" placeholder="Filter Games" isSearchable={false} isClearable={true} useStorageGames={true} value={gameFilter} onChange={(opt) => handleGameChange(opt)} />
					<div className="checkbox-container">
						<label htmlFor="shinydex-obtained-filter">
							<input id="shinydex-obtained-filter" type="checkbox" checked={showObtainedOnly} onChange={(e) => handleObtainedCheckbox(e.target.checked)} />
							Show obtained Pokémon only
						</label>
						<label htmlFor="shinydex-unobtained-filter">
							<input id="shinydex-unobtained-filter" type="checkbox" checked={showUnobtainedOnly} onChange={(e) => handleUnobtainedCheckbox(e.target.checked)} />
							Show unobtained Pokémon only
						</label>
						{pokemonFilter && (
							<label htmlFor="include-evolutions-filter" className="float">
								<input id="include-evolutions-filter" type="checkbox" checked={includeEvolutions} onChange={(e) => setIncludeEvolutions(e.target.checked)} />
								Include evolutions
							</label>
						)}
					</div>
					<button className="btn-primary add-shinydex-entry" onClick={() => setAddEntryModalOpen(true)}>Add New Entry</button>
				</>}
				page={
					<>
						<div className="shinydex-metadata">
							{pokemonFilter || gameFilter || showObtainedOnly || showUnobtainedOnly ? <h4>Showing {filteredDexList.length} Pokémon</h4> : (
								<>
									<h4>Obtained {numObtained} of {NUM_OBTAINABLE}</h4>
									<h4>{(numObtained / (NUM_OBTAINABLE) * 100).toFixed(2)}% complete</h4>
									<h4><a href="#" className="link-btn" onClick={shinyStatLinkClick}>Shinydex Stats</a></h4>
								</>
							)}
						</div>
						<ShinyDexList pokemon={filteredDexList} collection={shinydex} onFocus={setFocusedEntry} />
					</>
				}
			/>
			<AddShinydexEntryModal
				isOpen={addEntryModalOpen}
				close={() => setAddEntryModalOpen(false)}
			/>
			<ShinydexDetailModal
				close={() => setFocusedEntry(null)}
				pokemon={getPokemonById(focusedEntry)}
				entries={(shinydex || []).filter(entry => entry.pokemon === focusedEntry)}
			/>
			<ShinyStatsModal
				isOpen={showShinyStats}
				close={() => setShowShinyStats(false)}
			/>
		</>
	)
};

export default Shinydex;