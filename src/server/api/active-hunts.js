import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	res.send(JSON.stringify([
		{
			id: 1,
			userId: req.session.id,
			gameId: 'firered',
			pokemon: 1,
			huntType: 'Random Encounter',
			odds: '1/8192',
			encounters: 0,
		},
		{
			id: 52,
			userId: req.session.id,
			gameId: 'moon',
			pokemon: 52,
			huntType: 'Masuda Method',
			odds: '1/1365',
			encounters: 50
		},
		{
			id: 55,
			userId: req.session.id,
			gameId: 'sword',
			pokemon: 52,
			huntType: 'Masuda Method',
			odds: '1/1365',
			encounters: 50
		},
		{
			id: 500,
			userId: req.session.id,
			gameId: 'x',
			pokemon: 662,
			huntType: 'Masuda Method',
			odds: '1/1365',
			encounters: 50
		},
		{
			id: 1000,
			userId: req.session.id,
			gameId: 'crystal',
			pokemon: 130,
			huntType: 'Random Encounters',
			odds: '1/8192',
			encounters: 12
		},
		{
			id: 5200,
			userId: req.session.id,
			gameId: 'moon',
			pokemon: 103,
			huntType: 'Masuda Method',
			odds: '1/1365',
			encounters: 50
		}
	]));
});

router.post('/', async (req, res) => {
	const { gameId, pokemon, huntType, odds } = req.body;
	res.status(200).send({
		id: 2,
		userId: req.session.id,
		gameId,
		pokemon,
		huntType,
		odds,
		encounters: 0,
	});
});

router.put('/', async (req, res) => {
	const { id, userId, op, val } = req.body;
	if(op === 'inc') {
		// TODO Increment
	} else if(op === 'dec') {
		// TODO Decrement
	} else if(typeof(val) === 'number' && val >= 0) {
		// TODO Set value
	}
})

export default router;