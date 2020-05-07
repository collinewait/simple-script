const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

let dataBaseURL;

const { env } = process;

if (process.env.NODE_ENV === 'test') {
  dataBaseURL = env.TEST_DATABASE_URL;
}

const config = {
  SECRET_KEY: env.SECRET_KEY,
  SALT_ROUNDS: env.SALT_ROUNDS,
  expiresIn: env.expiresIn,
  DATABASE_URL: dataBaseURL || env.DATABASE_URL,
};

export default config;
