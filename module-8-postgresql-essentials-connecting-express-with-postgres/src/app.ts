import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { initDB, pool } from "./db";
import { userRouter } from "./modules/users/users.route";
import { profileRouter } from "./modules/profile/profile.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

// User Router
app.use("/api/v1/users", userRouter);
//Profile Router
app.use("/api/v1/profile", profileRouter);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Ph",
  });
});

export default app;
