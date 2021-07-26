import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import './new-hunt-form.scss';

const NewHuntForm = (props) => {
	const { onComplete } = props;
	const [game, setGame] = useState();
	const [huntType, setHuntType] = useState();
	const [pokemonHunted, setPokemonHunted] = useState();
	const [hasShinyCharm, setHasShinyCharm] = useState(false);
	const [hasLure, setHasLure] = useState(false);

	const dispatch = useDispatch();

	function submitHunt() {
		console.log('form submit');
		typeof(onComplete) === 'function' && onComplete();
	}

	return (
		<form onSubmit={submitHunt}>

		</form>
	);
}

export default NewHuntForm;