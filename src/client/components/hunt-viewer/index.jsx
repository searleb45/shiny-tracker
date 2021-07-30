import React from 'react';
import PokemonViewer from '../pokemon-viewer';

import './hunt-viewer.scss';

import POKEMON_LIST from '../../static/data/pokemon-list';
import GAME_LIST from '../../static/data/pokemon-games.json';

const HuntViewer = (props) => {
	const { hunt, onClick } = props;

	// Shallow clone Pokemon object to avoid mutating sprite for forms
	const pokemon = {...POKEMON_LIST.find((pkmn) => pkmn.id === hunt.pokemon)};
	const game = GAME_LIST.find((game) => game.gameId === hunt.gameId);

	if(game.useAlolanForm && pokemon.hasAlolanForm) {
		pokemon.sprite = pokemon.sprite.replace('.gif', '-alola.gif');
	}
	if(game.useGalarianForm && pokemon.hasGalarianForm) {
		pokemon.sprite = pokemon.sprite.replace('.gif', '-galar.gif');
	}

	return (
		<div className="hunt-viewer">
			<button onClick={onClick}>
				<div className="pokemon-image">
					<PokemonViewer pokemonId={hunt.pokemon} gameId={hunt.gameId} />
				</div>
				<div className="data-container">
					<div className="name">{pokemon.name}</div>
					<div className="game">{game.name}</div>
					<div className="hunt-type">{hunt.huntType}</div>
				</div>
			</button>
		</div>
	)
}

export default HuntViewer;