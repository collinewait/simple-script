/* eslint-disable no-underscore-dangle */
import * as authUtils from '../util/auth.utils';

export const userSignUp = async (req, res) => {
  const {
    firstName, lastName, email, password,
  } = req.body;
  const newPassword = await authUtils.hashPassword(password);

  const createdUser = await req.context.models.User.create({
    firstName,
    lastName,
    email,
    password: newPassword,
  });

  const payload = {
    id: createdUser._id,
    email: createdUser.email,
  };
  const token = await authUtils.generateToken(payload);
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
  await authUtils.validateCreds(user, password);
  const payload = {
    id: user.id,
    email,
  };
  const token = await authUtils.generateToken(payload);
  const data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  res.status(200).json({
    message: 'success',
    status: 200,
    token,
    data,
  });
};

export const addUser = async (req, res) => {
  const {
    firstName, lastName, email, password, isAdmin = false,
  } = req.body;
  const newPassword = await authUtils.hashPassword(password);

  const createdUser = await req.context.models.User.create({
    firstName,
    lastName,
    email,
    password: newPassword,
    isAdmin,
  });
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
  const newPassword = password ? await authUtils.hashPassword(password) : user.password;

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

export const getUserWithScripts = async (req, res) => {
  const {
    firstName, lastName, email, _id: id,
  } = req.context.user;
  const { userId } = req.params;

  const userScripts = await req.context.models.Script.findByUser(userId);
  const data = {
    user: {
      id,
      firstName,
      lastName,
      email,
    },
    scripts: userScripts || {},
  };

  res.status(200).json({
    message: 'success',
    status: 200,
    data,
  });
};
