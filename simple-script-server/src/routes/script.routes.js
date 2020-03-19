import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import { verifyUser } from '../middlewares/user.middleware';
import { createScript, getAllScripts } from '../controllers/script.controller';

const scriptRouter = Router();

scriptRouter
  .route('/scripts')
  .post(verifyUser, asyncHandler(createScript))
  .get(verifyUser, asyncHandler(getAllScripts));

export default scriptRouter;
