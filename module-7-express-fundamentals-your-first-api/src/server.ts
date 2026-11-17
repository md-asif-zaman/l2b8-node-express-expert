import express, { Application, Request, Response } from "express";
import { Pool } from "pg";
import "dotenv/config";

const port = 5000;
const app: Application = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

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
