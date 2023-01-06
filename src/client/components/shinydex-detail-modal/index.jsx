import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ShinyDexEntry from '../shinydex-entry';

import Modal from '../modal';

import EditIcon from '../../static/icons/edit.svg?react';
import DeleteIcon from '../../static/icons/delete.svg?react';
import CancelIcon from '../../static/icons/cancel.svg?react';
import SendIcon from '../../static/icons/send.svg?react';

import { putShinydexUpdate, deleteShinydexEntry } from '../../store/actions/shinydex';

import POKEMON_LIST from '../../static/data/pokemon-list';
import GAME_LIST from '../../static/data/pokemon-games.json';
import PokemonSelect from '../pokemon-select';
import GameSelect from '../game-select';

import './shinydex-detail-modal.scss';

const ShinydexDetailModal = (props) => {
	const { pokemon, entries, close } = props;
	const [editing, setEditing] = useState(null);
	const dispatch = useDispatch();

	if(!pokemon) return null;

	function handleDelete(id) {
		const confirmDelete = confirm('Are you sure you want to delete this entry? This cannot be undone!');

		if(confirmDelete) {
			dispatch(deleteShinydexEntry(id));
		}
	}

	function checkEnterSubmit(e) {
		if (e.which === 13) {
			submitEditing();
		}
	}

	function submitEditing() {
		setEditing(null);
		dispatch(putShinydexUpdate(editing.id, editing.gameId, editing.pokemon, editing.notes))
	}

	return (
		<Modal isOpen={!!pokemon} close={close} modalName={pokemon.name} containerClassName="shinydex-detail-modal">
			<ShinyDexEntry pokemon={pokemon} collected={entries.length > 0} />
			<h4>My Collection:</h4>
			<table>
				<thead>
					<tr>
						<th>Species</th>
						<th>Caught In</th>
						<th>Currently In</th>
						<th>Notes</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{entries.map(entry => editing && entry.id === editing.id ? (
						<tr key={entry.id}>
							<td>
								<PokemonSelect
									value={POKEMON_LIST.find(pkmn => pkmn.id === editing.pokemon)}
									onChange={opt => setEditing({...editing, pokemon: opt.id})}
									generation={GAME_LIST.find(game => game.gameId === editing.gameId).generation}
									onKeyDown={checkEnterSubmit}
								/>
							</td>
							<td>{GAME_LIST.find(game => game.gameId === entry.originGame).name}</td>
							<td>
								<GameSelect
									value={GAME_LIST.find(game => game.gameId === editing.gameId)}
									onChange={(opt) => setEditing({...editing, gameId: opt.gameId})}
									useStorageGames={true}
									isSearchable={false}
									onKeyDown={checkEnterSubmit}
								/>
							</td>
							<td>
								<textarea value={editing.notes} onChange={(e) => setEditing({...editing, notes: e.target.value})} maxLength="255" />
							</td>
							<td>
								<div className="interaction-container">
									<a href="#" className="submit-edit" title="Submit" onClick={submitEditing}>
										<SendIcon />
									</a>
									<a href="#" className="cancel-edit" title="Cancel Editing" onClick={() => setEditing(null)}>
										<CancelIcon />
									</a>
								</div>
							</td>
						</tr>
					) : (
						<tr key={entry.id}>
							<td>{POKEMON_LIST.find(pkmn => pkmn.id === entry.pokemon).name}</td>
							<td>{GAME_LIST.find(game => game.gameId === entry.originGame).name}</td>
							<td>{GAME_LIST.find(game => game.gameId === entry.gameId).name}</td>
							<td>{entry.notes}</td>
							<td>
								<div className="interaction-container">
									<a href="#" className="edit-entry" title="Edit" onClick={() => setEditing({...entry})}>
										<EditIcon />
									</a>
									<a href="#" className="delete-entry" title="Delete" onClick={() => handleDelete(entry.id)}>
										<DeleteIcon />
									</a>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{editing && (<form id="editForm" onSubmit={submitEditing} />)}
		</Modal>
	)
}

export default ShinydexDetailModal;