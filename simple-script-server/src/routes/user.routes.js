import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import { verifyUser, verifyAdmin } from '../middlewares/user.middleware';
import { addUser } from '../controllers/user.controller';

const userRouter = Router();

userRouter.route('/users').post(verifyUser, verifyAdmin, asyncHandler(addUser));

export default userRouter;
