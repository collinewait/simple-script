const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const { env } = process;
const config = { // defaults added for easy testing of the app. Not to be used in production
  SECRET_KEY: env.SECRET_KEY || 'some-cool-key',
  SALT_ROUNDS: env.SALT_ROUNDS || 10,
  expiresIn: env.expiresIn || '6days',
};
export default config;
