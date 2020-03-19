import { v4 as uuidv4 } from 'uuid';

import saveScript from '../models/scripts.model';

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

const createScript = async (req, res) => {
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

export default createScript;
