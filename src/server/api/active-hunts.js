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

	console.log(newHunt.toJSON());
	res.status(200).send(newHunt);
});

router.put('/', checkAuth, async (req, res) => {
	const { id, userId, op, val } = req.body;
	if(op === 'inc') {
		// TODO Increment
	} else if(op === 'dec') {
		// TODO Decrement
	} else if(op ==='complete') {
		// TODO Complete hunt
	} else if(typeof(val) === 'number' && val >= 0) {
		// TODO Set value
	}
});

router.delete('/', checkAuth, async(req, res) => {
	res.send('hi'); 
});

export default router;