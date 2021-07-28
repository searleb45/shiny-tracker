import express from 'express';
import activeHuntsController from './active-hunts.js';

const router = express.Router();

router.use('/active-hunts', activeHuntsController);

export default router;