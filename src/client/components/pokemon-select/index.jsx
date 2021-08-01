import React from 'react';
import Select from 'react-select';

import POKEMON_GENERATION_LIST from '../../static/data/pokemon.json';

const PokemonSelect = (props) => {
	const { id, value, onChange, generation } = props;

	const pokemonOptions = POKEMON_GENERATION_LIST
		.filter((gen) => generation === -1 || gen.generation <= generation)
		.reduce((acc, obj) => [...acc, ...obj.pokemon], []);
	
	return (
		<Select
			id={id}
			value={value || ''}
			onChange={(obj) => onChange(obj)}
			options={pokemonOptions}
			getOptionLabel={(obj) => obj.name}
			getOptionValue={(obj) => obj.id}
		/>
	)
}

export default PokemonSelect;