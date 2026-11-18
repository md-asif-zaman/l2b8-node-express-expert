import { Router } from "express";
import { userController } from "./users.controller";

const router = Router();

//* Create a User
// /api/v1/users
router.post("/", userController.createUser);

export const userRouter = router;
