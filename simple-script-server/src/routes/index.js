import express from 'express';

import authRouter from './auth.routes';

const router = express();

router.use('/api/auth', authRouter);

export default router;
