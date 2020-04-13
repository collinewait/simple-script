const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}
const { env } = process;
const config = {
  SECRET_KEY: env.SECRET_KEY,
  SALT_ROUNDS: env.SALT_ROUNDS,
  expiresIn: env.expiresIn,
  DATABASE_URL: env.DATABASE_URL,
};
export default config;
