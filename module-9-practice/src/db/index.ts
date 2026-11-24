import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.database_url,
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users_practice  (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        age INT,
        is_Active BOOLEAN DEFAULT true,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
      `);
    await pool.query(`
        CREATE TABLE IF NOT EXISTS profile_practice (
          id SERIAL PRIMARY KEY,
          user_id INT UNIQUE REFERENCES users_practice(id) ON DELETE CASCADE,
          bio TEXT,
          address TEXT,
          phone VARCHAR(15),
          gender VARCHAR(15),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()

        )
        `);
    console.log("Database connected successfully...");
  } catch (error) {
    console.log(error);
  }
};
