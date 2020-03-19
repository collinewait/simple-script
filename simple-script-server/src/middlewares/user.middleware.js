import { findOne } from '../models/user.model';
import { decodeToken } from '../util/auth.utils';
import { validateEmail } from '../util/auth.utils';

// eslint-disable-next-line consistent-return
export const validateUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    if (
      !email.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !password.trim()
    ) {
      return res.status(401).json({
        status: 401,
        message: ' Invalid details, all fields are required',
      });
    }

    const validEmail = validateEmail(email);
    if (!validEmail) {
      return res.status(401).json({
        status: 401,
        message: ' Invalid email address',
      });
    }

    const user = await findOne(email);
    if (user !== null) {
      return res.status(401).json({
        status: 401,
        message:
          ' Invalid details, please check your email address or password',
      });
    }
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const verifyUser = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token === undefined) {
    return res.status(401).json({
      status: 401,
      message: 'Token not provided',
    });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  const decoded = await decodeToken(token);

  if (Object.keys(decoded)[0] === 'error') {
    return res.status(401).json({
      status: 401,
      message: 'Invalid token, please login',
    });
  }
  const user = await findOne(decoded.email);

  res.locals.user = {
    email: decoded.email,
    firstName: user.firstName,
    lastName: user.lastName,
    userId: user.id,
  };
  next();
};
