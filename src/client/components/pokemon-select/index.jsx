import React from 'react';
import Select from 'react-select';

import POKEMON_GENERATION_LIST from '../../static/data/pokemon.json';

const PokemonSelect = (props) => {
	const { id, value, onChange, generation, maxHeight, onKeyDown, showAnyOption, prioritySort } = props;

	const pokemonOptions = POKEMON_GENERATION_LIST
		.filter((gen) => generation === -1 || gen.generation <= generation)
		.reduce((acc, obj) => [...acc, ...obj.pokemon], [])
		.filter((pkm) => showAnyOption || pkm.id !== 0) // Filter "Any" option for random hunt
		.sort((a,b) => {
			if (prioritySort?.includes(a.id) && prioritySort?.includes(b.id)) {
				return a.id - b.id;
			} else if (prioritySort?.includes(a.id)) {
				return -1;
			} else if (prioritySort?.includes(b.id)) {
				return 1;
			}
			return a.id - b.id;
		});
	
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
			styles={props.styles || {}}
		/>
	)
}

export default PokemonSelect;