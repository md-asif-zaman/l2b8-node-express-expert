import { Router } from "express";
import { userControllers } from "./users.controller";
import { auth } from "../../middlewares/auth";
import { USER_ROLE } from "../../types";

const router = Router();

router.post("/", userControllers.createUser);
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.agent),
  userControllers.getUsers,
);
router.get("/:id", userControllers.getSingleUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);

export const userRouter = router;
