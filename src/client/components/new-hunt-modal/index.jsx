import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../modal';
import { postNewHunt } from '../../store/actions/hunts';

import GameSelect from '../game-select';
import PokemonSelect from '../pokemon-select';
import HuntTypeSelect from '../hunt-select';

import calculateOdds from '../../huntOddsCalc';

import './new-hunt-modal.scss';

const NewHuntModal = (props) => {
	const { isOpen, close } = props;
	const [game, setGame] = useState();
	const [pokemonHunted, setPokemonHunted] = useState();
	const [huntType, setHuntType] = useState();
	const [hasShinyCharm, setHasShinyCharm] = useState(false);
	const [hasLure, setHasLure] = useState(false);
	const [hasResearch10, setHasResearch10] = useState(false);
	const [hasResearchPerfect, setHasResearchPerfect] = useState(false);

	const dispatch = useDispatch();

	function setResearchLevel(level, value) {
		if(level === '10') {
			setHasResearch10(value);
			if(value === false) {
				setHasResearchPerfect(false);
				setHasShinyCharm(false);
			}
		} else if(level === 'Perfect') {
			setHasResearchPerfect(value);
			if(value === true) {
				setHasResearch10(true);
			}
		}
	}

	function submitHunt(evt) {
		evt.preventDefault();
		dispatch(postNewHunt(
			game,
			pokemonHunted,
			huntType,
			hasShinyCharm,
			hasLure,
			hasResearch10,
			hasResearchPerfect,
			closeModal
		))
	}

	function setHasShinyCharmWrapper(val) {
		setHasShinyCharm(val);
		if(game.researchLevels) {
			if(val === true) {
				setResearchLevel('10', true);
			} else {
				setResearchLevel('10', false);
			}
		}
	}

	function setGameWrapper(game) {
		setGame(game);
		setPokemonHunted(undefined);
		setHuntType(undefined);
		setHasShinyCharm(false);
		setHasLure(false);
		setHasResearch10(false);
		setHasResearchPerfect(false);
	}

	function closeModal() {
		setGameWrapper(undefined);
		typeof(close) === 'function' && close();
	}

	return (
		<Modal
			isOpen={isOpen}
			close={closeModal}
			modalName="New Shiny Hunt"
			containerClassName="shiny-hunt-modal"
		>
			<form onSubmit={submitHunt}>
				<div className="form-input">
					<label htmlFor="newHuntGame">What game are you hunting in?</label>
					<GameSelect
						id="newHuntGame"
						value={game}
						onChange={(newGame) => setGameWrapper(newGame)}
						useStorageGames={false}
						menuHeight={300}
					/>
				</div>
				{game && (
					<>
						<div className="form-input">
							<label htmlFor="newHuntPokemon">Target Pokémon</label>
							<PokemonSelect
								id="newHuntPokemon"
								value={pokemonHunted}
								onChange={(pokemon) => setPokemonHunted(pokemon)}
								generation={game.generation}
								maxHeight={window.innerWidth > 768 ? 200 : 500}
							/>
						</div>
						<div className="form-input">
							<label htmlFor="newHuntMethod">Shiny hunting method</label>
							<HuntTypeSelect
								id="newHuntMethod"
								value={huntType}
								onChange={(type) => setHuntType(type)}
								generation={game.generation}
							/>
						</div>
						<div className="form-input">
							{game.shinyCharmAvailable && (
								<label htmlFor="newHuntHasShinyCharm">
									<input id="newHuntHasShinyCharm" type="checkbox" checked={hasShinyCharm} onChange={() => setHasShinyCharmWrapper(!hasShinyCharm)} />
									Do you have the Shiny Charm?
								</label>
							)}
							{game.lureAvailable && (
								<label htmlFor="newHuntHasLureActive">
									<input id="newHuntHasLureActive" type="checkbox" checked={hasLure} onChange={() => setHasLure(!hasLure)} />
									Are you using a lure?
								</label>
							)}
							{game.researchLevels && (
								<>
									<label htmlFor="newHuntHasResearch10">
										<input id="newHuntHasResearch10" type="checkbox" checked={hasResearch10} onChange={() => setResearchLevel('10', !hasResearch10)} />
										Have you achieved Research Level 10 for this Pokémon?
									</label>
									<label htmlFor="newHuntHasResearchPerfect">
										<input id="newHuntHasResearchPerfect" type="checkbox" checked={hasResearchPerfect} onChange={() => setResearchLevel('Perfect', !hasResearchPerfect)} />
										Have you achieved Perfect Research for this Pokémon?
									</label>
								</>
							)}
						</div>
						{ huntType && pokemonHunted && (<div className="bottom-submit">
							<div className="odds">{huntType && `Your shiny odds are: ${calculateOdds(huntType, { hasShinyCharm, hasLure, hasResearch10, hasResearchPerfect })}`}</div>
							<div className="submit">
								<button className="btn-primary" disabled={!(game && huntType && pokemonHunted)} type="submit">Submit</button>
							</div>
						</div>)}
					</>
				)}
			</form>
		</Modal>
	);
}

export default NewHuntModal;