import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import { verifyUser } from '../middlewares/user.middleware';
import createScript from '../controllers/script.controller';

const scriptRouter = Router();

scriptRouter.post('/scripts', verifyUser, asyncHandler(createScript));

export default scriptRouter;
