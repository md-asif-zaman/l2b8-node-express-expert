import express, { Application, Request, Response } from "express";
import { Pool } from "pg";
import "dotenv/config";

const port = 5000;
const app: Application = express();

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
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

initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Ph",
  });
});

app.post("/", async (req: Request, res: Response) => {
  const { name, age, password } = req.body;
  console.log(password);

  res.status(200).json({
    success: true,
    message: "This is a test api",
    data: { name, age },
  });
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});
