import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import {
  verifyUser,
  verifyAdmin,
  findUser,
} from '../middlewares/user.middleware';
import {
  addUser,
  getAllUsers,
  updateUser,
} from '../controllers/user.controller';

const userRouter = Router();

userRouter
  .route('/users')
  .post(verifyUser, verifyAdmin, asyncHandler(addUser))
  .get(verifyUser, verifyAdmin, asyncHandler(getAllUsers));
userRouter.use('/users/:userEmail', verifyUser, verifyAdmin, findUser); // used userEmail for ease, userId is better
userRouter.route('/users/:userEmail').put(asyncHandler(updateUser)); // used userEmail for ease, userId is better

export default userRouter;
