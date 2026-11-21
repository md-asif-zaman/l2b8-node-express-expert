import { Router } from "express";
import { userControllers } from "./users.controller";

const router = Router();

router.post("/", userControllers.createUser);
router.get("/", userControllers.getUsers);
router.get("/:id", userControllers.getSingleUser);
router.delete("/:id", userControllers.deleteUser);

export const userRouter = router;
