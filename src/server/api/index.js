import express from 'express';
import activeHuntsController from './active-hunts';

const router = express.Router();

router.use('/active-hunts', activeHuntsController);

export default router;