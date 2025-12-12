const pokedex = require('pokedex');
const fs = require('fs');

const myDex = new pokedex();

function capitalize(str) {
	return str.split('-').map((token) => token.charAt(0).toUpperCase() + token.substr(1)).join('-');
}
let pokemonList = [];
let i=1;
for(let pokemon = myDex.pokemon(i); i<=898; pokemon = myDex.pokemon(++i)) {
	console.log(pokemon);
	pokemonList.push({
		id: i,
		species_id: parseInt(pokemon.species_id || '0'),
		name: capitalize(pokemon.name),
		sprite: `/sprites/${pokemon.name}.gif`
	});
}

fs.writeFileSync('pokemon.json', JSON.stringify(pokemonList));