import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { userRouter } from "./modules/users/users.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";

const app: Application = express();

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

// Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const log = `\n Method: ${req.method} || URL: ${req.url} || Time: ${Date.now()}\n`;
  fs.appendFile("logger.txt", log, (err) => console.log(err));
  next();
});

// User Router
app.use("/api/v1/users", userRouter);
//Profile Router
app.use("/api/v1/profile", profileRouter);
// Authentication Route
app.use("/api/v1/auth", authRoute);

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Ph",
  });
});

export default app;
