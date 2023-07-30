import React from 'react';
import Select from 'react-select';

import POKEMON_GENERATION_LIST from '../../static/data/pokemon.json';

const PokemonSelect = (props) => {
	const { id, value, onChange, generation, maxHeight, onKeyDown, showAnyOption } = props;

	const pokemonOptions = POKEMON_GENERATION_LIST
		.filter((gen) => generation === -1 || gen.generation <= generation)
		.reduce((acc, obj) => [...acc, ...obj.pokemon], [])
		.filter((pkm) => showAnyOption || pkm.id !== 0) // Filter "Any" option for random hunt
		.sort((a,b) => a.id - b.id);
	
	return (
		<Select
			id={id}
			value={value || ''}
			onChange={(obj) => onChange(obj)}
			options={pokemonOptions}
			getOptionLabel={(obj) => obj.name}
			getOptionValue={(obj) => obj.id}
			className="react-select pokemon-select"
			classNamePrefix="react-select"
			maxMenuHeight={maxHeight || 500}
			onKeyDown={onKeyDown}
		/>
	)
}

export default PokemonSelect;