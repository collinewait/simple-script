import logger from './winston';

// eslint-disable-next-line consistent-return
const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    let errStatus = error.kind === 'ObjectId' ? 404 : error.status || 500;

    if (error.name === 'MongoError' && error.code === 11000) {
      errStatus = 400;
      return res.status(400).send({
        status: 400,
        message: 'Duplicates are not allowed',
      });
    }

    if (errStatus === 500) {
      logger.error(`Server Error: ${500} - ${error.message}, Stack: ${error.stack}`);
    }

    return res.status(errStatus).send({
      status: errStatus,
      message: error.message,
    });
  }
};

export default asyncHandler;
