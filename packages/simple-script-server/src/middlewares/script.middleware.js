export const findScript = async (req, res, next) => {
  const { scriptId } = req.params;

  const notFound = {
    status: 404,
    message: `script not found with id: ${scriptId}`,
  };

  if (scriptId.match(/^[0-9a-fA-F]{24}$/)) {
    const script = await req.context.models.Script.findSingleScript(scriptId);
    if (!script) {
      return res.status(404).json(notFound);
    }
    req.context = {
      ...req.context,
      script,
    };
    return next();
  }

  return res.status(404).json(notFound);
};

export default findScript;
