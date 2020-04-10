import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';

export const generateToken = async payload =>
  jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: config.expiresIn,
  });

export const decodeToken = async token => {
  const data = jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
    if (err) return { error: err.message };
    return decoded;
  });
  return data;
};

export const hashPassword = async password => {
  const RADIX = 10;
  const salt = await bcrypt.genSalt(parseInt(config.SALT_ROUNDS, RADIX));
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
};

export const validateEmail = email => {
  const reg = /\S+@\S+\.\S+/;
  return reg.test(email);
};

export const validateCreds = async (userObj, password) => {
  const error401 = {
    status: 401,
    message: 'Invalid credentials',
  };
  if (!userObj) {
    throw error401;
  }
  const isMatch = await bcrypt.compare(password, userObj.password);
  if (!isMatch) {
    throw error401;
  }
};
