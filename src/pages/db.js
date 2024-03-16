import pg from 'pg';

const { Pool } = pg;

let pool;
try {
  pool = new Pool({connectionString: process.env.POSTGRES_URL ,ssl: { rejectUnauthorized: false }});
} catch (error) {
  console.error('Error creating pool', error);
}

export default {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
};