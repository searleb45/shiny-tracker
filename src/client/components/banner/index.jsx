import React from 'react';

import './banner.scss';

export default (props) => {
	const { message, onClose } = props;

	return message ? (
		<div className="error-banner">
			{message}
			<button
				className="close-error-banner"
				onClick={() => typeof onClose === 'function' && onClose()}>
					&times;
			</button>
		</div>
	) : null
}