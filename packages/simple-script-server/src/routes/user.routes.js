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
  getUserScripts,
} from '../controllers/user.controller';

const userRouter = Router();

userRouter
  .route('/users')
  .post(
    asyncHandler(verifyUser),
    asyncHandler(verifyAdmin),
    asyncHandler(addUser),
  )
  .get(
    asyncHandler(verifyUser),
    asyncHandler(verifyAdmin),
    asyncHandler(getAllUsers),
  );
userRouter.use(
  '/users/:userId',
  asyncHandler(verifyUser),
  asyncHandler(verifyAdmin),
  asyncHandler(findUser),
);
userRouter
  .route('/users/:userId')
  .put(asyncHandler(updateUser))
  .get(asyncHandler(getUserScripts));

export default userRouter;
