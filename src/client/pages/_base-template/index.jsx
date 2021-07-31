import React from 'react';

import './base-template.scss';

const BasePageTemplate = (props) => {
	const { header, page, className } = props;

	return (
		<main className={`base-page-template ${className}`}>
			<div className="header">
				{header}
			</div>
			<div className="page">
				{page}
			</div>
		</main>
	)
}

export default BasePageTemplate;