import { Router } from "express";
import { userController } from "./users.controller";

const router = Router();
// /api/v1/users

//* Create a User
router.post("/", userController.createUser);

//* Get All Users
router.get("/", userController.getAllUsers);

//* Get Single User
router.get("/:id", userController.getSingleUser);
export const userRouter = router;

//* Update a User
router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);
