import { findOne } from '../models/scripts.model';

export const findScript = async (req, res, next) => {
  const { scriptId } = req.params;
  const { email } = res.locals.user;

  const script = await findOne(email, scriptId);
  if (script) {
    req.script = script;
    next();
  } else {
    return res.status(400).json({
      status: 400,
      message: `script not found with id: ${scriptId}`,
    });
  }
};

export default findScript;
