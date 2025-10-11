import React, { useState } from 'react';
import Modal from '../modal';
import { useSelector } from 'react-redux';

import POKEMON_LIST from '../../static/data/pokemon-list';
import POKEMON_GENERATION_LIST from '../../static/data/pokemon.json';

import './shiny-stats-modal.scss';
import ShinyDexEntry from '../shinydex-entry';
import ProgressBar from '../progress-bar'

import lock from '../../static/icons/lock.svg';

const NUM_POKEMON = POKEMON_LIST.length - 1;

const NUM_SHINY_LOCKED = POKEMON_LIST.filter((pkmn) => pkmn.shinyLocked === true).length;

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

	const notObtained = POKEMON_LIST.filter((pkmn) => pkmn.id !== 0 && !pkmn.shinyLocked && !shinydex.find((entry) => entry.pokemon === pkmn.id));

	const getGenerationBreakdown = () => {
		const elements = [];
		for (let i=0; i < GENERATIONS.length; i++) {
			const monsInGen = GENERATIONS[i].pokemon.length;
			const shinyLocked = GENERATIONS[i].pokemon.filter((pkmn) => pkmn.shinyLocked === true).length;
			elements.push((
				<div className="generation-row" key={`generation-${i}`}>
					<div className="generation-header">Generation {i + 1}{shinyLocked > 0 && (<><img src={lock} /><span className="generation-subheader">{shinyLocked}</span></>)}</div>
					{/* {shinyLocked > 0 && <div className="generation-subheader">{shinyLocked} Pokémon shiny locked</div>} */}
					<div className="row">
						<ProgressBar value={obtainedByGen[i]} maxValue={monsInGen - shinyLocked} />
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
				<div style={{ marginBottom: '0.5rem'}}>
					<ProgressBar value={numObtained} maxValue={NUM_POKEMON - NUM_SHINY_LOCKED} />
					<div className="subtext">Unobtainable shinies not counted - see below</div>
				</div>
				<div className="row">
					<div className="title">Number remaining</div>
					<div className="value">{NUM_POKEMON - NUM_SHINY_LOCKED - numObtained}</div>
				</div>
				<div className="row">
					<div className="title">Total shinies</div>
					<div className="value">{shinydex.length}</div>
				</div>
				<div className="row">
					<div className="title">Duplicates</div>
					<div className="value">{shinydex.length - numObtained}</div>
				</div>
				<div className="row">
					<div className="title">Unobtainable shinies</div>
					<div className="value">{NUM_SHINY_LOCKED}</div>
				</div>
			</div>
			<h4>Generation Breakdown</h4>
			<div className="generations-container">
				{getGenerationBreakdown()}
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
		</Modal>
	)
}

export default ShinyStatsModal;