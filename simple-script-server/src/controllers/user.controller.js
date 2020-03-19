import { v4 as uuidv4 } from 'uuid';
import { generateToken, hashPassword, validateCreds } from '../util/auth.utils';
import { createUser, findOne } from '../models/user.model';

export const userSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newPassword = await hashPassword(password);
  const newUser = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    password: newPassword,
  };
  const { dataValues } = await createUser(newUser);
  const payload = {
    id: dataValues.id,
    email: dataValues.email,
  };
  const token = await generateToken(payload);
  const data = {
    id: dataValues.id,
    firstName: dataValues.firstName,
    lastName: dataValues.lastName,
    email: dataValues.email,
  };
  res.status(201).json({
    message: 'success',
    status: 201,
    data,
    token,
  });
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne(email);
  await validateCreds(user, password);
  const payload = {
    id: user.id,
    email,
  };
  const token = await generateToken(payload);
  res.status(200).send({
    message: 'Success',
    token,
  });
};
