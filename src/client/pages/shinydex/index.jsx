import React from 'react';

import BasePageTemplate from '../_base-template';
// import HuntViewer from '../../components/hunt-viewer';

import POKEMON_LIST from '../../static/data/pokemon-list';

const Shinydex = () => {
	return (
		<BasePageTemplate
			className="shinydex"
			header={'filters'}
			page={POKEMON_LIST.map(pkmn => <div>{pkmn.name}</div>)}
		/>
	)
};

export default Shinydex;