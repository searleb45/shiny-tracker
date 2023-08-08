import POKEMON_GENERATION_LIST from './pokemon.json';

export default POKEMON_GENERATION_LIST
	.reduce((prev, newgen) => [...prev, ...newgen.pokemon.map((pkmn) => ({...pkmn, generation: newgen.generation}))], [])
	.sort((a, b) => a.id - b.id);