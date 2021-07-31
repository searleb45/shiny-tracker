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

	// Dummy test data
	// res.send(JSON.stringify([
	// 	{
	// 		id: 1,
	// 		userId: req.session.id,
	// 		gameId: 'firered',
	// 		pokemon: 1,
	// 		huntType: 'Random Encounter',
	// 		odds: '1/8192',
	// 		encounters: 8192,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	},
	// 	{
	// 		id: 52,
	// 		userId: req.session.id,
	// 		gameId: 'moon',
	// 		pokemon: 52,
	// 		huntType: 'Masuda Method',
	// 		odds: '1/1365',
	// 		encounters: 50,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	},
	// 	{
	// 		id: 55,
	// 		userId: req.session.id,
	// 		gameId: 'sword',
	// 		pokemon: 52,
	// 		huntType: 'Masuda Method',
	// 		odds: '1/1365',
	// 		encounters: 50,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	},
	// 	{
	// 		id: 500,
	// 		userId: req.session.id,
	// 		gameId: 'x',
	// 		pokemon: 662,
	// 		huntType: 'Masuda Method',
	// 		odds: '1/1365',
	// 		encounters: 50,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	},
	// 	{
	// 		id: 1000,
	// 		userId: req.session.id,
	// 		gameId: 'crystal',
	// 		pokemon: 130,
	// 		huntType: 'Random Encounters',
	// 		odds: '1/8192',
	// 		encounters: 12,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	},
	// 	{
	// 		id: 5200,
	// 		userId: req.session.id,
	// 		gameId: 'moon',
	// 		pokemon: 103,
	// 		huntType: 'Masuda Method',
	// 		odds: '1/1365',
	// 		encounters: 50,
	// 		started: new Date(2020, 2, 12, 3, 18, 12)
	// 	}
	// ]));
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
	const { id, op, val } = req.body;
	const hunt = await db.hunt.findOne({
		where: {
			userId: req.session.id,
			id,
			completed: false
		}
	});
	
	if(op === 'inc') {
		hunt.encounters = hunt.encounters + 1;
	} else if(op === 'dec') {
		hunt.encounters = Math.max(hunt.encounters - 1, 0);
	} else if(op ==='complete') {
		hunt.completed = true;
		hunt.completionDate = new Date();
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