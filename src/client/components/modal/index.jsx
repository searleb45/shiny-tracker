import React, { useEffect } from 'react';
import ReactModal from 'react-modal';

import './modal.scss';

ReactModal.setAppElement('#root');

const Modal = (props) => {
	const modalOpts = {
		isOpen: props.isOpen,
		onRequestClose: props.close,
		style: {
			overlay: {
				zIndex: 100,
				backgroundColor: 'rgba(0, 0, 0, 0.75'
			}
		},
		contentLabel: props.modalName,
		className: `modal-container ${props.containerClassName}`
	};

	useEffect(() => {
		if(modalOpts.isOpen) {
			document.body.style.overflow = 'hidden';
	
			return () => {
				document.body.style.overflow = 'auto';
			}
		}
	}, [props.isOpen]);

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