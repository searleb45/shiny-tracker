import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../modal';
import { postNewHunt } from '../../store/actions/hunts';

import GameSelect from '../game-select';
import PokemonSelect from '../pokemon-select';
import HuntTypeSelect from '../hunt-select';

import './new-hunt-modal.scss';

const NewHuntModal = (props) => {
	const { isOpen, close } = props;
	const [game, setGame] = useState();
	const [pokemonHunted, setPokemonHunted] = useState();
	const [huntType, setHuntType] = useState();
	const [hasShinyCharm, setHasShinyCharm] = useState(false);
	const [hasLure, setHasLure] = useState(false);

	const dispatch = useDispatch();

	function submitHunt(evt) {
		evt.preventDefault();
		dispatch(postNewHunt(
			game,
			pokemonHunted,
			huntType,
			hasShinyCharm,
			hasLure,
			closeModal
		))
	}

	function setGameWrapper(game) {
		setGame(game);
		setPokemonHunted(undefined);
		setHuntType(undefined);
		setHasShinyCharm(false);
		setHasLure(false);
	}

	function closeModal() {
		setGameWrapper(undefined);
		typeof(close) === 'function' && close();
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
						{ huntType && pokemonHunted && (<div className="bottom-submit">
							<div className="odds">{huntType && `Your shiny odds are: ${calculateOdds(huntType, hasShinyCharm, hasLure)}`}</div>
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