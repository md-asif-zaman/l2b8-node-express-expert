import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRouter } from "./modules/users/users.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

// User Router
app.use("/api/v1/users", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Ph",
  });
});

//* Get All Users
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * from users`);

    res.status(201).json({
      success: true,
      message: "User Retrieved Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

//* Get Single User
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);

    const result = await pool.query(`SELECT * from users WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "User Retrieved Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

//* Update a User
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, age, is_Active } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET 
      name = COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($3, age),
      is_Active = COALESCE($4, is_Active),
      updated_at = NOW()
      WHERE id = $5 RETURNING *
      `,
      // if name do not come from user then set name == null. So COALESCE do not accept new name and remain old name in database
      [name ?? null, password ?? null, age ?? null, is_Active ?? null, id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "User Retrieved Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
    DELETE FROM users
    WHERE id = $1
    `,
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(201).json({
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
});

export default app;
