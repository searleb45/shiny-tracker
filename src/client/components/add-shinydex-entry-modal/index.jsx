import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../modal';

import GameSelect from '../game-select';
import PokemonSelect from '../pokemon-select';

import { postNewShinydexEntry } from '../../store/actions/shinydex';

import './add-shinydex-entry-modal.scss';

const NewShinydexEntryModal = (props) => {
	const { isOpen, close } = props;
	const [game, setGame] = useState(null);
	const [pokemon, setPokemon] = useState(null);
	const [notes, setNotes] = useState('');

	const dispatch = useDispatch();

	function submitEntry(evt) {
		evt.preventDefault();
		dispatch(postNewShinydexEntry(game, pokemon, notes, closeModal));
	}

	function closeModal() {
		setGame(null);
		setPokemon(null);
		setNotes('');
		typeof(close) === 'function' && close();
	}

	function setGameWrapper(game) {
		setGame(game);
		setPokemon(null);
	}

	return (
		<Modal
			isOpen={isOpen}
			close={closeModal}
			modalName="New Shinydex Entry"
			containerClassName="add-shinydex-entry-modal"
		>
			<form onSubmit={submitEntry}>
				<div className="form-input">
					<label htmlFor="newEntryGame">What game is your shiny in?</label>
					<GameSelect
						id="newEntryGame"
						value={game}
						onChange={(newGame) => setGameWrapper(newGame)}
						useStorageGames={true}
						menuHeight={300}
					/>
				</div>
				{game && (
					<>
						<div className="form-input">
							<label htmlFor="newEntryPokemon">What Pokémon?</label>
							<PokemonSelect
								id="newEntryPokemon"
								generation={game.generation}
								value={pokemon}
								onChange={(newPokemon) => setPokemon(newPokemon)}
							/>
						</div>
						<div className="form-input">
							<label htmlFor="newEntryNotes">Any notes (when/how obtained, level, CP, alternate forms)?</label>
							<textarea id="newEntryNotes" value={notes} onChange={(e) => setNotes(e.target.value)} maxLength="255" />
							<div className="textarea-counter">{255 - notes.length}/255 characters remaining</div>
						</div>
						<div className="submit">
							<button className="btn-primary" disabled={!(game && pokemon)} type="submit">Submit</button>
						</div>
					</>
				)}
			</form>
		</Modal>
	);
}

export default NewShinydexEntryModal;