import { v4 as uuidv4 } from 'uuid';

import {
  saveScript,
  getUserScripts,
  removeScript,
} from '../models/scripts.model';

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
    if (operations[0] in validOperations) {
      return `${operations[0]}`;
    }
    throw invalidOps;
  }

  let script = '';
  let i;
  for (i = 0; i < len - 1; i += 1) {
    if (operations[i] in validOperations) {
      script = `${script}${operations[i]}\n`;
    } else {
      throw invalidOps;
    }
  }

  const lastOperation = operations[len - 1];
  if (lastOperation in validOperations) {
    script = `${script}${lastOperation}`;
  } else {
    throw invalidOps;
  }

  return script;
};

const verifyScript = async script => {
  if (!script || !script.length) {
    return false;
  }
  const lines = script.split('\n');
  const isInvalid = lines.some(line => !(line in validOperations));
  return !isInvalid;
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
  const { email } = res.locals.user;

  if (operations && operations.length) {
    const script = await generateScript(operations);
    const id = uuidv4();
    const newScript = { id, script, runResults: '' };
    const savedScript = await saveScript(email, newScript);

    res.status(201).json({
      message: 'success',
      status: 201,
      data: savedScript,
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
  const { email } = res.locals.user;
  const scripts = await getUserScripts(email);
  const data = scripts || {};
  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};

export const getSingleScript = async (req, res) => {
  const { script } = req;
  const data = script || {};
  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};

export const updateScript = async (req, res) => {
  const isValid = await verifyScript(req.body.script);
  if (isValid) {
    const { script } = req;
    const { email } = res.locals.user;
    const runResults =
      script.script === req.body.script ? script.runResults : '';
    const newUpdate = {
      ...script,
      script: req.body.script,
      runResults,
    };
    script.script = req.body.script;
    const updatedScript = await saveScript(email, newUpdate);
    res.status(200).json({
      message: 'success',
      status: 200,
      data: updatedScript,
    });
  } else {
    throw invalidOps;
  }
};

export const deleteScript = async (req, res) => {
  const { script } = req;
  const { email } = res.locals.user;
  const deletedScript = await removeScript(email, script);
  if (deletedScript) {
    res.status(204).json({});
  } else {
    const err = {
      status: 500,
      message: 'something wrong happened during deletion',
    };
    throw err;
  }
};

export const updateScriptOutput = async (req, res) => {
  const { script } = req;
  const { email } = res.locals.user;
  const scriptOutput = await executeScript(script.script);
  const scriptWithUpdatedOutput = {
    ...script,
    runResults: scriptOutput,
  };
  const updatedScript = await saveScript(email, scriptWithUpdatedOutput);
  res.status(200).json({
    message: 'success',
    status: 200,
    data: updatedScript,
  });
};
