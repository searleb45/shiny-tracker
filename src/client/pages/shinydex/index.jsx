import React from 'react';

import BasePageTemplate from '../_base-template';

import POKEMON_LIST from '../../static/data/pokemon-list';
import ShinyDexEntry from '../../components/shinydex-entry';

const Shinydex = () => {
	return (
		<BasePageTemplate
			className="shinydex"
			header={'filters'}
			page={POKEMON_LIST.map(pkmn => <ShinyDexEntry key={pkmn.id} pokemon={pkmn} collected={pkmn.id===1} />)}
		/>
	)
};

export default Shinydex;