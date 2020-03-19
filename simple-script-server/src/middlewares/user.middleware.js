import { findOne } from '../models/user.model';
import { validateEmail } from '../util/auth.utils';

// eslint-disable-next-line consistent-return
const validateUser = async (req, res, next) => {
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

export default validateUser;
