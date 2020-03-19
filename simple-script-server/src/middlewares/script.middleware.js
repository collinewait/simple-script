import { findOne } from '../models/scripts.model';

export const findScript = async (req, res, next) => {
  const { scriptId } = req.params;
  const { email } = res.locals.user;

  const script = await findOne(email, scriptId);
  req.script = script;
  next();
};

export default findScript;
