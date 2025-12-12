import React from 'react';

import './pokemon-viewer.scss';

import { getPokemonById } from '../../../shared/dataLookup';

const PokemonViewer = (props) => {
	const { pokemonId, gameId } = props;
	
	// Shallow clone pokemon object to avoid mutating sprite
	const pokemon = {...getPokemonById(pokemonId)};

	return (
		<div className="pokemon-viewer">
			<img loading="lazy" src={pokemon.sprite} />
		</div>
	)
}

export default PokemonViewer;