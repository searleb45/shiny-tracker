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
	res.send(results);
});

export default router;