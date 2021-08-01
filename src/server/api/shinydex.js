import express from 'express';
import { checkAuth } from '../auth';

import db from '../db';

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
	const results = await db.shinydex.findAll({
		where: {
			userId: req.session.id,
		}
	});
	res.send(results);
});

router.post('/', checkAuth, async (req, res) => {
	const { gameId, pokemon, notes } = req.body;

	const newEntry = await db.shinydex.create({
		userId: req.session.id,
		gameId,
		pokemon,
		notes
	});

	res.status(200).send(newEntry);
});

router.put('/', checkAuth, async (req, res) => {
	const { id, gameId, pokemon, notes } = req.body;
	const entry = await db.shinydex.findOne({
		where: {
			userId: req.session.id,
			id,
		}
	});
	
	entry.gameId = gameId;
	entry.pokemon = pokemon;
	entry.notes = notes;

	await entry.save();
	res.status(200).send(entry);
});

router.delete('/:id', checkAuth, async(req, res) => {
	const { id } = req.params;

	const response = await db.shinydex.destroy({
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