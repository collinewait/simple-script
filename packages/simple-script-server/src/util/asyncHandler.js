const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    const errStatus = error.kind === 'ObjectId' ? 404 : error.status || 500;

    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(400).send({
        status: 400,
        error: 'Duplicates are not allowed',
      });
    }

    return res.status(errStatus).send({
      status: errStatus,
      error: error.message,
    });
  }
};

export default asyncHandler;
