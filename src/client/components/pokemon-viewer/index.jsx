import React from 'react';

import './pokemon-viewer.scss';

import POKEMON_LIST from '../../static/data/pokemon-list';
import GAME_LIST from '../../static/data/pokemon-games.json';

const PokemonViewer = (props) => {
	const { pokemonId, gameId } = props;
	
	// Shallow clone pokemon object to avoid mutating sprite
	const pokemon = {...POKEMON_LIST.find((pkmn) => pkmn.id === pokemonId)};
	const game = GAME_LIST.find((game) => game.gameId === gameId);

	if(game.useAlolanForm && pokemon.hasAlolanForm) {
		pokemon.sprite = pokemon.sprite.replace('.gif', '-alola.gif');
	}
	if(game.useGalarianForm && pokemon.hasGalarianForm) {
		pokemon.sprite = pokemon.sprite.replace('.gif', '-galar.gif');
	}

	return (
		<div className="pokemon-viewer">
			<img src={pokemon.sprite} />
		</div>
	)
}

export default PokemonViewer;