import React from 'react';
import ReactModal from 'react-modal';

import './modal.scss';

ReactModal.setAppElement('#root');

const Modal = (props) => {
	const modalOpts = {
		isOpen: props.isOpen,
		onRequestClose: props.close,
		style: {
			overlay: {
				zIndex: 1,
				backgroundColor: 'rgba(0, 0, 0, 0.75'
			},
			content: {
				inset: '90px 40px',
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '1rem',
				paddingTop: 0
			}
		},
		contentLabel: props.modalName,
	};

	return (
		<ReactModal {...modalOpts}>
			<header className="modal-header">
				<h2 className="modal-title">{props.modalName || ''}</h2>
				<button className="modal-close" onClick={() => props.close()}>&times;</button>
			</header>
			<main className="modal-content">
				{props.children}
			</main>
		</ReactModal>
	)
}

export default Modal;