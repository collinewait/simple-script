import express from 'express';

import authRouter from './auth.routes';
import scriptRouter from './script.routes';

const router = express();

router.use('/api/auth', authRouter);
router.use('/api/v1', scriptRouter);

export default router;
