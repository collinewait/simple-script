import { v4 as uuidv4 } from 'uuid';
import { generateToken, hashPassword } from '../util/auth.utils';
import { createUser } from '../models/user.model';

const userSignUp = async (req, res) => {
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
export default userSignUp;
