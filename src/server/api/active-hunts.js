import express from 'express';
import { checkAuth } from '../auth';

import db from '../db';
import { getGameById, getPokemonById, getHuntTypeById } from '../../shared/dataLookup';
import { getAggregatePercentage, calculateOdds } from '../../shared/huntOddsCalc';
const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
	const results = await db.hunt.findAll({
		where: {
			userId: req.session.id,
			completed: false
		},
		order: [
			['id', 'ASC']
		]
	});
	let mappedResults;
	if (req.headers.pbl_acct_id) {
		mappedResults = results.map((result) => {
			const { pokemon, encounters, huntType, gameId } = result.dataValues;

			const percentageObj = getAggregatePercentage(result.dataValues);

			return {
				id: result.dataValues.id,
				pokemon: getPokemonById(pokemon).name,
				encounters: encounters,
				huntType: getHuntTypeById(huntType).name,
				game: getGameById(gameId).name,
				odds: percentageObj.oddsString,
				percentage: percentageObj.percentage.toFixed(2) + '%',
				encountersTo90: percentageObj.encountersTo90,
			};
		});
	} else {
		mappedResults = results.map((result) => ({ ...result.dataValues, lastUpdated: result.dataValues.lastUpdated || result.dataValues.lastupdated}));
	}
	res.send(mappedResults);
});

router.post('/', checkAuth, async (req, res) => {
	const { gameId, pokemon, huntType, hasShinyCharm, hasLure, hasResearch10, hasResearchPerfect, hasSparklingPower } = req.body;

	const newHunt = await db.hunt.create({
		userId: req.session.id,
		gameId,
		pokemon,
		huntType,
		hasShinyCharm,
		hasLure,
		hasResearch10,
		hasResearchPerfect,
		hasSparklingPower,
		isStaticOdds: false
	});

	res.status(200).send(newHunt);
});

router.put('/', checkAuth, async (req, res) => {
	const { id, op, val, str, pokemon } = req.body;
	const hunt = await db.hunt.findOne({
		where: {
			userId: req.session.id,
			id,
			completed: false
		}
	});
	
	if (hunt) {
		if(op === 'complete') {
			hunt.completed = true;
			hunt.completionDate = new Date();
			hunt.encounters = val;
	
			await db.shinydex.create({
				userId: req.session.id,
				gameId: hunt.gameId,
				originGame: hunt.gameId,
				pokemon: hunt.pokemon || pokemon,
				notes: str
			})
		} else if(typeof(val) === 'number' && val >= 0) {
			hunt.encounters = val
		}
		await hunt.save();
		res.status(200).send({...hunt.dataValues, lastUpdated: hunt.dataValues.lastUpdated || hunt.dataValues.lastupdated});
	} else {
		res.status(500).send('ERROR: Hunt not found');
	}

});

router.delete('/:id', checkAuth, async(req, res) => {
	const { id } = req.params;

	const response = await db.hunt.destroy({
		where: {
			id,
			userId: req.session.id
		}
	});

	if(response === 1) {
		res.status(200).send();
	} else {
		res.status(500).send();
	}
});

export default router;