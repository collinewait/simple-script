import mongoose from 'mongoose';

import config from '../config';

const connectDb = () => mongoose.connect(config.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

export default connectDb;
