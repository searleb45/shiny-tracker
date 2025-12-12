import React from 'react';
import PokemonViewer from '../pokemon-viewer';

import './hunt-viewer.scss';

import { getPokemonById, getGameById, getHuntTypeById } from '../../../shared/dataLookup';

const HuntViewer = (props) => {
	const { hunt, onClick } = props;

	// Shallow clone Pokemon object to avoid mutating sprite for forms
	const pokemon = {...getPokemonById(hunt.pokemon)};
	const game = getGameById(hunt.gameId);
	const huntType = getHuntTypeById(hunt.huntType) || {name: hunt.huntType};

	return (
		<div className="hunt-viewer">
			<button onClick={onClick}>
				<div className="pokemon-image">
					<PokemonViewer pokemonId={hunt.pokemon} gameId={hunt.gameId} />
				</div>
				<div className="data-container">
					<div className="name">{pokemon.name}</div>
					<div className="game">{game.name}</div>
					<div className="hunt-type">{huntType.name}</div>
				</div>
			</button>
		</div>
	)
}

export default HuntViewer;