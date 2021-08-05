import React from 'react';
import Select from 'react-select';

import HUNT_LIST from '../../static/data/hunt-types.json';

const HuntTypeSelect = (props) => {
	const { id, value, onChange, generation } = props;

	const huntOptions = HUNT_LIST
		.filter((type) => type.generations.includes(generation));
	
	return (
		<Select
			id={id}
			isSearchable={false}
			value={value || ''}
			onChange={(obj) => onChange(obj)}
			options={huntOptions}
			getOptionLabel={(obj) => `${obj.name}${obj.hintText ? ` (${obj.hintText})` : ''}`}
			getOptionValue={(obj) => obj.name}
			className="react-select hunt-select"
			classNamePrefix="react-select"
		/>
	)
}

export default HuntTypeSelect;