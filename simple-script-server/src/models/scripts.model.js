import db from '../db';

export const saveScript = async (userEmail, script) => {
  if (db.scripts[userEmail]) {
    db.scripts[userEmail][script.id] = script;
  } else {
    db.scripts[userEmail] = {};
    db.scripts[userEmail][script.id] = script;
  }
  db.scripts[userEmail][script.id] = script;
  return {
    ...script,
  };
};

export const getUserScripts = async userEmail => {
  const scripts = db.scripts[userEmail];
  return scripts;
};
