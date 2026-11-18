import { Pool } from "pg";
import config from "../config";

//* Connect with NeonDB
export const pool = new Pool({
  connectionString: config.connection_string,
});

//* Make User Table
export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users  (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log({ error });
  }
};
