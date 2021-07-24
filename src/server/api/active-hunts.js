import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
	res.send(JSON.stringify([
		{
			id: 1,
			pkmn: 150,
			encounters: 0,
			odds: '1/8192'
		}
	]));
});

export default router;