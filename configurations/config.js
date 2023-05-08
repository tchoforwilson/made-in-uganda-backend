import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

/**
 * @breif Configuration object to hold all environmental variables
 */

const config = {
  /**
   * @breif The basic API environment, port and prefix configuration values
   */
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  prefix: process.env.API_PREFIX || '/api/v1',
  /**
   * @breif Database for various environments
   */
  db: {
    dev: process.env.DATABASE_DEV,
    test: process.env.DATABASE_TEST,
    prod: process.env.DATABASE_PROD,
  },
  /**
   * @breif JWT important variables
   * */
  jwt: {
    // The secret used to sign and validate signature
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    cookieExpires: process.env.JWT_COOKIE_EXPIRES_IN,
  },
  /**
   * @breif Mail trap variables
   */
  mailTrap: {
    name: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
  },
};

export default config;
