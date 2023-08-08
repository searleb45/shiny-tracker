import React from 'react';
import Select from 'react-select';

import './game-select.scss';

import GAME_DATA from '../../static/data/pokemon-games.json';

const GameSelect = (props) => {
	const { id, value, onChange, useStorageGames, placeholder, isClearable, isSearchable, menuHeight, onKeyDown } = props;

	const options = GAME_DATA.filter((game) => {
		if (useStorageGames && game.storageGame) {
			return true;
		} else if (game.storageGame) {
			return false;
		}

		if (props.generationFloor) {
			return game.generation >= props.generationFloor;
		}

		return true;
	});

	return (
		<Select
			id={id}
			options={options}
			formatOptionLabel={(obj, ctx) => {
				return ctx.context === 'value' ? obj.name : (
					<div className="game-option">
						<div className="game-box" style={{backgroundImage: `url(${obj.boxArt})`, backgroundPositionY: obj.boxArtOffset || 'center'}}></div>
						<div className="game-name">{obj.name}</div>
					</div>
				);
			}}
			value={value}
			getOptionLabel={opt => opt.name}
			getOptionValue={opt => opt.gameId}
			onChange={(newOpt) => onChange(newOpt)}
			maxMenuHeight={menuHeight || 500}
			className="react-select game-select"
			classNamePrefix="react-select"
			placeholder={placeholder}
			isClearable={isClearable || false}
			isSearchable={isSearchable || true}
			// menuIsOpen={true}
			onKeyDown={onKeyDown}
		/>
	);
}

export default GameSelect;