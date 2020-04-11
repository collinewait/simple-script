import models from '../models';

const Context = (req, res, next) => {
  req.context = {
    models,
  };
  return next();
};

export default Context;
