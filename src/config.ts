import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || '65.19.141.67';
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'darnel88_TS';
const MYSQL_USER = process.env.MYSQL_USER || 'darnel88_test';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'MtnyfKmUKjJh48E';

const MYSQL = {
  host: MYSQL_HOST,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
};
const SERVER_PORT = process.env.SERVER_PORT || 1337;
const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT,
};

const config = {
  server: SERVER,
  mysql: MYSQL,
};

export default config;
