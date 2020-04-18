/* eslint-disable no-underscore-dangle */
import { decodeToken, validateEmail } from '../util/auth.utils';

// eslint-disable-next-line consistent-return
export const validateUser = async (req, res, next) => {
  const inValidUserMsg = 'Invalid details, please check your email address or password';
  const {
    email, firstName, lastName, password,
  } = req.body;
  if (
    !email.trim()
    || !firstName.trim()
    || !lastName.trim()
    || !password.trim()
  ) {
    return res.status(401).json({
      status: 401,
      message: 'Invalid details, all fields are required',
    });
  }

  const validEmail = validateEmail(email);
  if (!validEmail) {
    return res.status(401).json({
      status: 401,
      message: inValidUserMsg,
    });
  }
  const user = await req.context.models.User.findByEmail(email);
  if (user) {
    return res.status(401).json({
      status: 401,
      message: inValidUserMsg,
    });
  }
  return next();
};

export const verifyUser = async (req, res, next) => {
  const loginRequest = 'Invalid credentials, please login';
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token === undefined) {
    return res.status(401).json({
      status: 401,
      message: loginRequest,
    });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  const decoded = await decodeToken(token);

  if (Object.keys(decoded)[0] === 'error') {
    return res.status(401).json({
      status: 401,
      message: loginRequest,
    });
  }
  const user = await req.context.models.User.findByEmail(decoded.email);

  if (user) {
    req.context = {
      ...req.context,
      loggedIn: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id,
        isAdmin: user.isAdmin,
      },
    };
    return next();
  }

  return res.status(401).json({
    status: 401,
    message: loginRequest,
  });
};

export const verifyAdmin = async (req, res, next) => {
  const { isAdmin } = req.context.loggedIn;
  if (isAdmin) {
    return next();
  }

  return res.status(403).json({
    status: 403,
    message: 'permission denied',
  });
};

export const findUser = async (req, res, next) => {
  const { userId } = req.params;
  const user = await req.context.models.User.findById(userId);
  if (user) {
    req.context = {
      ...req.context,
      user,
    };
    return next();
  }

  return res.status(400).json({
    status: 400,
    message: `user not found with id: ${userId}`,
  });
};
