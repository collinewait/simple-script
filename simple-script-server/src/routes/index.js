import express from 'express';

import authRouter from './auth.routes';
import scriptRouter from './script.routes';
import userRouter from './user.routes';

const router = express();

router.use('/api/auth', authRouter);
router.use('/api/v1', scriptRouter);
router.use('/api/v1', userRouter);

export default router;
