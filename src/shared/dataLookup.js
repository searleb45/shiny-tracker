import POKEMON_LIST from './data/pokemon-list';
import GAME_LIST from './data/pokemon-games.json';
import HUNT_LIST from './data/hunt-types.json';

export const getPokemonById = (id) => {
	return POKEMON_LIST.find(pkmn => pkmn.id === id);
}

export const getGameById = (gameId) => {
	return GAME_LIST.find(game => game.gameId === gameId);
}

export const getHuntTypeById = (huntTypeId) => {
	return HUNT_LIST.find(hunt => hunt.id === huntTypeId);
}