import express from 'express';
import { checkAuth } from '../auth';

import db from '../db';

const router = express.Router();

router.get('/', checkAuth, async (req, res) => {
	const results = await db.hunt.findAll({
		where: {
			userId: req.session.id,
			completed: true
		}
	});
	const mappedResults = results.map((result) => ({ ...result.dataValues, lastUpdated: result.dataValues.lastUpdated || result.dataValues.lastupdated}));
	res.send(mappedResults);
});

export default router;