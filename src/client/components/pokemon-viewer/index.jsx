import React from 'react';

import './pokemon-viewer.scss';

const PokemonViewer = (props) => {
	const { pokemon } = props;

	return (
		<div className="pokemon-viewer">
			<img src={pokemon.sprite} />
		</div>
	)
}

export default PokemonViewer;