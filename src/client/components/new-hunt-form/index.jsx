import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import GameSelect from '../game-select';

import './new-hunt-form.scss';

const NewHuntForm = (props) => {
	const { onComplete } = props;
	const [game, setGame] = useState();
	const [pokemonHunted, setPokemonHunted] = useState();
	const [huntType, setHuntType] = useState();
	const [hasShinyCharm, setHasShinyCharm] = useState(false);
	const [hasLure, setHasLure] = useState(false);

	const dispatch = useDispatch();

	function submitHunt() {
		console.log('form submit');
		typeof(onComplete) === 'function' && onComplete();
	}

	function setGameWrapper(game) {
		setGame(game);
		setPokemonHunted(undefined);
		setHuntType(undefined);
		setHasShinyCharm(false);
		setHasLure(false);
	}

	function setPokemonWrapper(pokemon) {
		setPokemonHunted(pokemon);
		setHuntType(undefined);
	}

	function setHuntTypeWrapper(huntType) {
		setHuntType(huntType);
	}

	function calculateOdds(huntType, hasShinyCharm, hasLure) {
		if(hasLure && hasShinyCharm) {
			return huntType.lureShinyCharmOdds || huntType.shinyCharmOdds || huntType.baseOdds;
		} else if(hasLure) {
			return huntType.lureOdds || huntType.baseOdds;
		} else if(hasShinyCharm) {
			return huntType.shinyCharmOdds || huntType.baseOdds;
		} else {
			return huntType.baseOdds;
		}
	}

	return (
		<form onSubmit={submitHunt}>
			<div className="form-input">
				<label htmlFor="newHuntGame">Game</label>
				<GameSelect
					id="newHuntGame"
					value={game}
					onChange={(newGame) => setGameWrapper(newGame)}
					useStorageGames={false}
				/>
			</div>
			{game && (
				<>
					<div className="form-input">
						<label htmlFor="newHuntPokemon">Pokémon</label>
						{/* TODO: Pokemon select */}
					</div>
					<div className="form-input">
						<label htmlFor="newHuntMethod">Shiny hunting method</label>
						{/* TODO Hunt select */}
					</div>
					<div className="form-input">
						{game.shinyCharmAvailable && (
							<label htmlFor="newHuntHasShinyCharm">
								<input id="newHuntHasShinyCharm" type="checkbox" value={hasShinyCharm} onClick={() => setHasShinyCharm(!hasShinyCharm)} />
								Do you have the Shiny Charm?
							</label>
						)}
						{game.lureAvailable && (
							<label htmlFor="newHuntHasLureActive">
								<input id="newHuntHasLureActive" type="checkbox" value={hasLure} onClick={() => setHasLure(!hasLure)} />
								Are you using a lure?
							</label>
						)}
					</div>
				</>
			)}
			<div className="bottom-submit">
				<div className="odds">{huntType && `Your shiny odds are: ${calculateOdds(huntType, hasShinyCharm, hasLure)}`}</div>
				<div className="submit">
					<button disabled={!(game && huntType && pokemonHunted)} type="submit">Submit</button>
				</div>
			</div>
		</form>
	);
}

export default NewHuntForm;