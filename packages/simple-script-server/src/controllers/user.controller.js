/* eslint-disable no-underscore-dangle */
import { generateToken, hashPassword, validateCreds } from '../util/auth.utils';

export const userSignUp = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  const newPassword = await hashPassword(password);
  const newUser = new req.context.models.User({
    firstName,
    lastName,
    email,
    password: newPassword,
  });
  const createdUser = await newUser.save();

  const payload = {
    id: createdUser._id,
    email: createdUser.email,
  };
  const token = await generateToken(payload);
  const data = {
    id: createdUser._id,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
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
  const user = await req.context.models.User.findByEmail(email);
  await validateCreds(user, password);
  const payload = {
    id: user.id,
    email,
  };
  const token = await generateToken(payload);
  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
  };
  res.status(200).send({
    message: 'Success',
    token,
    data,
  });
};

export const addUser = async (req, res) => {
  const {
    firstName, lastName, email, password, isAdmin = false,
  } = req.body;
  const newPassword = await hashPassword(password);
  const newUser = new req.context.models.User({
    firstName,
    lastName,
    email,
    password: newPassword,
    isAdmin,
  });
  const createdUser = await newUser.save();
  const data = {
    id: createdUser._id,
    firstName: createdUser.firstName,
    lastName: createdUser.lastName,
    email: createdUser.email,
  };
  res.status(201).json({
    message: 'success',
    status: 201,
    data,
  });
};

export const getAllUsers = async (req, res) => {
  const { userId } = req.context.loggedIn;
  const users = await req.context.models.User.findUsers(userId);
  res.status(200).json({
    message: 'success',
    status: 200,
    data: users,
  });
};

export const updateUser = async (req, res) => {
  const { user } = req.context;
  const {
    firstName = user.firstName,
    lastName = user.lastName,
    email = user.email,
    password,
    isAdmin = user.isAdmin,
  } = req.body;
  const newPassword = password ? await hashPassword(password) : user.password;

  user.firstName = firstName;
  user.lastName = lastName;
  user.password = newPassword;
  user.isAdmin = isAdmin;
  user.email = email;

  const updatedUser = await user.save();
  const data = {
    id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
  };
  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};

export const getUserScripts = async (req, res) => {
  const { user } = req;
  const { userId } = req.params;

  const userScripts = await req.context.models.Script.findByUser(userId);
  const data = {
    ...user,
    scripts: userScripts || {},
  };

  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};
