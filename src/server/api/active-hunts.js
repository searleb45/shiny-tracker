import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	res.send(JSON.stringify([
		{
			id: 1,
			userId: 'testuser',
			gameId: 'firered',
			pokemon: 1,
			huntType: 'Random Encounter',
			odds: '1/8192',
			encounters: 0,
		}
	]));
});

router.post('/', async (req, res) => {
	const { gameId, pokemon, huntType, odds, userId } = req.body;
	res.status(200).send({
		id: 2,
		userId,
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