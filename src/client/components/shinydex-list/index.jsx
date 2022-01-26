import React from 'react';
import { List, WindowScroller } from 'react-virtualized';
import ShinyDexEntry from '../../components/shinydex-entry';
import 'react-virtualized/styles.css';

import useWindowSize from '../../hooks/useWindowSize';

import './shinydex-list.scss';

const ShinyDexList = (props) => {
	const { pokemon, collection, onFocus } = props;
	const { width: windowWidth } = useWindowSize();
	const itemsPerRow = windowWidth >= 1200 ? 3 : windowWidth >= 768 ? 2 : 1;
	const rowHeight = windowWidth >= 1200 ? 170 : 200;

	return (
		<WindowScroller>
			{({ height, isScrolling, onChildScroll, scrollTop }) => (
				<List
					className="ignore-parent-flex shinydex-scrollcontainer"
					autoHeight
					height={height}
					isScrolling={isScrolling}
					onScroll={onChildScroll}
					scrollTop={scrollTop}
					rowCount={Math.ceil(pokemon.length / itemsPerRow)}
					rowHeight={rowHeight}
					width={windowWidth}
					overscanRowCount={20}
					rowRenderer={({ index, key, style }) => {
						const items = [];
						const fromIndex = index * itemsPerRow;
						const toIndex = Math.min(fromIndex + itemsPerRow, pokemon.length);

						for(let i=fromIndex; i<toIndex; i++) {
							const pkmn = pokemon[i];

							items.push(
								<ShinyDexEntry
									key={pkmn.id}
									pokemon={pkmn}
									collected={collection.some(entry => entry.pokemon === pkmn.id)}
									onClick={() => onFocus(pkmn.id)}
								/>
							);
						}
						return (
							<div className="shinydex-row" key={key} style={style}>
								{items}
							</div>
						);
					}}
				/>
			)}
		</WindowScroller>
	)
};

export default ShinyDexList;