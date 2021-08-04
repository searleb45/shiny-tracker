import express from 'express';
import { checkAuth } from '../auth';

import db from '../db';

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
	const results = await db.hunt.findAll({
		where: {
			userId: req.session.id,
			completed: false
		}
	});
	res.send(results);
});

router.post('/', checkAuth, async (req, res) => {
	const { gameId, pokemon, huntType, odds } = req.body;

	const newHunt = await db.hunt.create({
		userId: req.session.id,
		gameId,
		pokemon,
		huntType,
		odds
	});

	res.status(200).send(newHunt);
});

router.put('/', checkAuth, async (req, res) => {
	const { id, op, val, str } = req.body;
	const hunt = await db.hunt.findOne({
		where: {
			userId: req.session.id,
			id,
			completed: false
		}
	});
	
	if(op ==='complete') {
		hunt.completed = true;
		hunt.completionDate = new Date();
		hunt.encounters = val;

		await db.shinydex.create({
			userId: req.session.id,
			gameId: hunt.gameId,
			pokemon: hunt.pokemon,
			notes: str
		})
	} else if(typeof(val) === 'number' && val >= 0) {
		hunt.encounters = val
	}

	await hunt.save();
	res.status(200).send(hunt);
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