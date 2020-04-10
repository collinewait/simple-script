import { Router } from 'express';

import asyncHandler from '../util/asyncHandler';
import { verifyUser } from '../middlewares/user.middleware';
import {
  createScript,
  getAllScripts,
  getSingleScript,
  updateScript,
  deleteScript,
  updateScriptOutput,
} from '../controllers/script.controller';
import { findScript } from '../middlewares/script.middleware';

const scriptRouter = Router();

scriptRouter
  .route('/scripts')
  .post(verifyUser, asyncHandler(createScript))
  .get(verifyUser, asyncHandler(getAllScripts));
scriptRouter.use('/scripts/:scriptId', verifyUser, findScript);
scriptRouter
  .route('/scripts/:scriptId')
  .get(asyncHandler(getSingleScript))
  .put(asyncHandler(updateScript))
  .patch(asyncHandler(updateScriptOutput))
  .delete(asyncHandler(deleteScript));

export default scriptRouter;
