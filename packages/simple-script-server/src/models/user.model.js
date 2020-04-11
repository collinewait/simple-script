import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.statics.findByEmail = async function findUserByEmail(email) {
  const user = await this.findOne({ email });
  return user;
};

userSchema.statics.findUsers = async function findUsersExceptRequestingAdmin(
  adminId,
) {
  const users = await this.find({ _id: { $ne: adminId } }).select('-__v');
  return users;
};

userSchema.pre('remove', next => {
  // eslint-disable-next-line no-underscore-dangle
  this.model('Script').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;
