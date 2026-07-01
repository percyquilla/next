import 'server-only';
import { Pool } from 'pg';

const isSocket = process.env.DB_HOST?.startsWith('/cloudsql');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: isSocket ? false : { rejectUnauthorized: false },
  max: 10,
});

export default pool;
