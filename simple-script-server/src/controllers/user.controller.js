import { v4 as uuidv4 } from 'uuid';
import { generateToken, hashPassword, validateCreds } from '../util/auth.utils';
import { createUser, findOne, findAll } from '../models/user.model';

export const userSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const newPassword = await hashPassword(password);
  const newUser = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    password: newPassword,
    isAdmin: false,
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
    isAdmin: dataValues.isAdmin,
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
  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  await validateCreds(user, password);
  const payload = {
    id: user.id,
    email,
  };
  const token = await generateToken(payload);
  res.status(200).send({
    message: 'Success',
    token,
    data,
  });
};

export const addUser = async (req, res) => {
  const { firstName, lastName, email, password, isAdmin = false } = req.body;
  const newPassword = await hashPassword(password);
  const newUser = {
    id: uuidv4(),
    firstName,
    lastName,
    email,
    password: newPassword,
    isAdmin,
  };
  const { dataValues } = await createUser(newUser);
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
  });
};

export const getAllUsers = async (req, res) => {
  const { email } = res.locals.user;
  const users = await findAll(email);
  res.status(200).json({
    message: 'success',
    status: 200,
    data: users,
  });
};

export const updateUser = async (req, res) => {
  const { user } = req;
  const {
    firstName = user.firstName,
    lastName = user.lastName,
    password,
    isAdmin = user.isAdmin,
  } = req.body;
  const newPassword = password ? await hashPassword(password) : user.password;
  const updatedUser = {
    ...user,
    firstName,
    lastName,
    password: newPassword,
    isAdmin,
  };

  const { dataValues } = await createUser(updatedUser);
  const data = {
    id: dataValues.id,
    firstName: dataValues.firstName,
    lastName: dataValues.lastName,
    email: dataValues.email,
    isAdmin: dataValues.isAdmin,
  };
  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};
