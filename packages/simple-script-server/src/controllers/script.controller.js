/* eslint-disable no-prototype-builtins */ // Rule disable object has hardcoded keys
/* eslint-disable no-underscore-dangle */

const validOperations = {
  'DoThisThing(string)': 1,
  'DoThatThing(integer)': 2,
  'DoTheOtherThing(float)': 3,
};

const invalidOps = {
  status: 400,
  message: 'request contains invalid operations',
};

const generateScript = async operations => {
  const len = operations.length;
  if (len === 1) {
    if (validOperations.hasOwnProperty(operations[0])) {
      return `${operations[0]}`;
    }
    throw invalidOps;
  }

  let script = '';
  let i;
  for (i = 0; i < len - 1; i += 1) {
    if (validOperations.hasOwnProperty(operations[i])) {
      script = `${script}${operations[i]}\n`;
    } else {
      throw invalidOps;
    }
  }

  const lastOperation = operations[len - 1];
  if (validOperations.hasOwnProperty(lastOperation)) {
    script = `${script}${lastOperation}`;
  } else {
    throw invalidOps;
  }

  return script;
};

const executeScript = async scriptStr => {
  const output = [];
  const lines = scriptStr.split('\n');

  lines.forEach(line => {
    if (line.length === 1) {
      const err = 'Random Error';
      throw err;
    }

    if (line.startsWith('DoThis')) {
      output.push(line.length);
    } else if (line.startsWith('DoThat')) {
      output.push(line.substring(line.length - 4));
    } else if (line.startsWith('DoTheOther')) {
      output.push(line.substring(line.length % 2));
    } else {
      const err = 'Not Valid';
      throw err;
    }
  });

  return output;
};

export const createScript = async (req, res) => {
  const { operations } = req.body;
  const { userId } = req.context.loggedIn;

  if (operations && operations.length) {
    const script = await generateScript(operations);

    const savedScript = await req.context.models.Script.create({
      script, runResults: [], user: userId,
    });

    res.status(201).json({
      message: 'success',
      status: 201,
      data: {
        id: savedScript._id,
        runResults: savedScript.runResults,
        script: savedScript.script,
      },
    });
  } else {
    const missingOps = {
      status: 400,
      message: 'request missing operations',
    };
    throw missingOps;
  }
};

export const getAllScripts = async (req, res) => {
  const { userId } = req.context.loggedIn;
  const scripts = await req.context.models.Script.findByUser(userId);
  return res.status(200).json({
    message: 'success',
    status: 200,
    data: scripts,
  });
};

export const getSingleScript = async (req, res) => {
  const { script } = req.context;
  res.status(200).json({
    message: 'success',
    status: 200,
    data: {
      id: script._id,
      runResults: script.runResults,
      script: script.script,
    },
  });
};

export const updateScript = async (req, res) => {
  const { operations } = req.body;
  if (operations && operations.length) {
    const newScript = await generateScript(operations);
    const { script } = req.context;
    const runResults = script.script === newScript ? script.runResults : [];
    script.script = newScript;
    script.runResults = runResults;
    const updatedScript = await script.save();
    res.status(200).json({
      message: 'success',
      status: 200,
      data: {
        id: updatedScript._id,
        runResults: updatedScript.runResults,
        script: updatedScript.script,
      },
    });
  } else {
    const missingOps = {
      status: 400,
      message: 'request missing operations',
    };
    throw missingOps;
  }
};

export const deleteScript = async (req, res) => {
  await req.context.script.remove();
  res.sendStatus(204);
};

export const updateScriptOutput = async (req, res) => {
  const { script } = req.context;
  const scriptOutput = await executeScript(script.script);
  script.runResults = scriptOutput;
  const updatedScript = await script.save();
  res.status(200).json({
    message: 'success',
    status: 200,
    data: {
      id: updatedScript._id,
      runResults: updatedScript.runResults,
      script: updatedScript.script,
    },
  });
};
