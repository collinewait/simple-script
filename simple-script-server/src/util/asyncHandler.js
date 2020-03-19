const asyncHandler = callback => async (req, res, next) => {
  try {
    await callback(req, res, next);
  } catch (error) {
    const errStatus = error.kind === 'ObjectId' ? 404 : error.status || 500;
    res.status(errStatus).send({
      status: errStatus,
      error: error.message,
    });
  }
};

export default asyncHandler;
