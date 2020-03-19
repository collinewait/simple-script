import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';

export const generateToken = async payload =>
  jwt.sign(payload, config.SECRET_KEY, {
    expiresIn: config.expiresIn,
  });

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
