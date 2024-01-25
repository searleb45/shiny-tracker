import React, { useState } from 'react';
import Modal from '../modal';
import { useSelector } from 'react-redux';

import POKEMON_LIST from '../../static/data/pokemon-list';
import POKEMON_GENERATION_LIST from '../../static/data/pokemon.json';

import './shiny-stats-modal.scss';
import ShinyDexEntry from '../shinydex-entry';

const NUM_POKEMON = POKEMON_LIST.length - 1;

const GENERATIONS = POKEMON_GENERATION_LIST
	.filter((gen) => gen.generation > 0)
	.reduce((arr, gen) => {
		if (gen.generation % 1 === 0) {
			let genArray = [...gen.pokemon];
			POKEMON_GENERATION_LIST.forEach((innerGen) => {
				if (innerGen.generation !== gen.generation && Math.floor(innerGen.generation) === gen.generation) {
					genArray = [...genArray, ...innerGen.pokemon];
				}
			});

			return [...arr, {generation: gen.generation, pokemon: genArray}];
		}

		return arr;
	}, []);

const ShinyStatsModal = (props) => {
	const { isOpen, close } = props;
	const shinydex = useSelector(state => state.shinyDex);
	const [randomTarget, setRandomTarget] = useState(null);

	const obtainedByGen = GENERATIONS.map((gen) => {
		return gen.pokemon.reduce((acc, pkmn) => {
			return shinydex.some(entry => entry.pokemon === pkmn.id) ? acc + 1 : acc;
		}, 0)
	});

	const numObtained = obtainedByGen.reduce((acc, gen) => {
		return acc + gen;
	}, 0);

	const notObtained = POKEMON_LIST.filter((pkmn) => pkmn.id !== 0 && !shinydex.find((entry) => entry.pokemon === pkmn.id));

	const getGenerationBreakdown = () => {
		const elements = [];
		for (let i=0; i < GENERATIONS.length; i++) {
			const monsInGen = GENERATIONS[i].pokemon.length;
			elements.push((
				<div className="generation-row" key={`generation-${i}`}>
					<div className="generation-header">Generation {i + 1}</div>
					<div className="row">
						<div className="title">Obtained</div>
						<div className="value">{obtainedByGen[i]}/{monsInGen}</div>
					</div>
					<div className="row">
						<div className="title">% completed</div>
						<div className="value">{(obtainedByGen[i] / monsInGen * 100).toFixed(2)}%</div>
					</div>
				</div>
			))
		}

		return elements;
	}

	function pickRandomTarget(notObtained) {
		setRandomTarget(notObtained[Math.floor(Math.random() * notObtained.length)]);
	}

	return (
		<Modal isOpen={isOpen} close={close} modalName="Shinydex Stats" containerClassName="shinydex-stats-modal">
			<h4>Overall Stats</h4>
			<div className="overall-wrapper">
				<div className="row">
					<div className="title">Number obtained</div>
					<div className="value">{numObtained}/{NUM_POKEMON}</div>
				</div>
				<div className="row">
					<div className="title">Number remaining</div>
					<div className="value">{NUM_POKEMON - numObtained}</div>
				</div>
				<div className="row">
					<div className="title">Percentage completed</div>
					<div className="value">{(numObtained / NUM_POKEMON * 100).toFixed(2)}%</div>
				</div>
				<div className="row">
					<div className="title">Total shinies</div>
					<div className="value">{shinydex.length}</div>
				</div>
				<div className="row">
					<div className="title">Duplicates</div>
					<div className="value">{shinydex.length - numObtained}</div>
				</div>
			</div>
			{notObtained.length > 0 && 
				<div className="overall-wrapper">
					{randomTarget && (
						<>
							<h4>Random Target</h4>
							<ShinyDexEntry pokemon={randomTarget} showSprite={true}/>
						</>
					)}
					<button className="btn btn-primary" onClick={() => pickRandomTarget(notObtained)}>{randomTarget ? 'Pick New Target' : 'Generate Random Hunt Target'}</button>
				</div>
			}
			<h4>Generation Breakdown</h4>
			<div className="generations-container">
				{getGenerationBreakdown()}
			</div>
		</Modal>
	)
}

export default ShinyStatsModal;