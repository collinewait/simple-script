import { findOne } from '../models/user.model';

// eslint-disable-next-line consistent-return
const validateUser = async (req, res, next) => {
  try {
    const { email } = req.body;
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
