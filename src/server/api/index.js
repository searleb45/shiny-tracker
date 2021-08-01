import express from 'express';
import activeHuntsController from './active-hunts';
import completedHuntsController from './completed-hunts';
import shinydexController from './shinydex';

const router = express.Router();

router.use('/active-hunts', activeHuntsController);
router.use('/completed-hunts', completedHuntsController);
router.use('/shinydex', shinydexController);

export default router;