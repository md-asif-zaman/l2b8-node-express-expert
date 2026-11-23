import { Router } from "express";
import { userController } from "./users.controller";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../../types";

const router = Router();
// /api/v1/users

//* Create a User
router.post("/", userController.createUser);

//* Get All Users
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userController.getAllUsers,
);

//* Get Single User
router.get(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  userController.getSingleUser,
);

//* Update a User
router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.user),
  userController.updateUser,
);

router.delete("/:id", userController.deleteUser);

export const userRouter = router;
