import React from 'react';
import PokemonViewer from '../pokemon-viewer';

import pokeBall from '../../static/icons/Pokeball.png';

import './shinydex-entry.scss';

const ShinyDexEntry = (props) => {
	const { pokemon, collected, showSprite, onClick } = props;

	return (
		<div className="shinydex-entry">
			<button onClick={onClick}>
				<div className={`pokemon-image ${!(collected || showSprite) && 'silhouette'}`}>
					<PokemonViewer pokemonId={pokemon.id} />
				</div>
				<div className="data-container">
					<div className="name">
						{collected && <img src={pokeBall} />}
						{pokemon.name}
					</div>
				</div>
			</button>
		</div>
	)
}

export default ShinyDexEntry;