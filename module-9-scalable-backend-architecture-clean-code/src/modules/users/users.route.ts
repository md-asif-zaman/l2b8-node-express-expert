import { Router } from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";

const router = Router();
// /api/v1/users

//* Create a User
router.post("/", userController.createUser);

//* Get All Users
router.get("/", auth("admin", "agent"), userController.getAllUsers);

//* Get Single User
router.get("/:id", userController.getSingleUser);

//* Update a User
router.put("/:id", userController.updateUser);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
