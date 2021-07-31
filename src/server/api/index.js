import express from 'express';
import activeHuntsController from './active-hunts';
import completedHuntsController from './completed-hunts';

const router = express.Router();

router.use('/active-hunts', activeHuntsController);
router.use('/completed-hunts', completedHuntsController);

export default router;