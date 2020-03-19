import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import validateUser from '../middlewares/user.middleware';
import userSignUp from '../controllers/user.controller';

const authRouter = Router();

authRouter.post('/signup', validateUser, asyncHandler(userSignUp));

export default authRouter;
