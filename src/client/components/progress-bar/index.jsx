import React from 'react';
import './progress-bar.scss';

const ProgressBar = (props) => {
	const { value, maxValue } = props;
	const barWidth = (value / (maxValue || 100)) * 100;

	return (
		<div className="progressWrapper">
			<div className="progressAmount" style={{width: `${barWidth}%`}} />
			<div className="progressText">{maxValue ? `${value}/${maxValue} (${barWidth.toFixed(2)}%)` : `${value}%`}</div>
		</div>
	)
};

export default ProgressBar;