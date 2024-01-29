import React, { useEffect, useState } from 'react';

import TopIcon from '../../static/icons/top.svg?react';

import './base-template.scss';

const BasePageTemplate = (props) => {
	const { header, page, className } = props;
	const [scrollPos, setScrollPos] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			setScrollPos(window.scrollY);
		}

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<main className={`base-page-template ${className}`}>
			<div className="header">
				{header}
			</div>
			<div className="page">
				{page}
			</div>
			{scrollPos > window.innerHeight * 2 && (
				<button
					className="btn-primary scrollTop"
					onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
					aria-label="Scroll to top"
				>
					<TopIcon />
				</button>
			)}
		</main>
	)
}

export default BasePageTemplate;