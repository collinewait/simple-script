import db from '../db';

export const createUser = async user => {
  const { email, ...userInfo } = user;
  db.users[email] = userInfo;
  return { dataValues: { ...user } };
};

export const findOne = async userEmail => {
  if (userEmail in db.users) {
    return db.users[userEmail];
  }
  return null;
};

export const findAll = async userEmail => {
  const { [userEmail]: _, ...otherUsers } = db.users;
  return otherUsers;
};
