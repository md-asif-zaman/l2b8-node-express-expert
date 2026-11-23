import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { userRouter } from "./modules/users/users.route";
import { profileRouter } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import fs from "fs";
import { logger } from "./middleware/logger";
import globalErrorHandler from "./middleware/globarErrorHandler";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(express.text());
// middleware for form data & nested data
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5000",
    optionsSuccessStatus: 200,
  }),
);

app.use(cookieParser());

// Logger Middleware
app.use(logger);

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

app.use(globalErrorHandler);

export default app;
