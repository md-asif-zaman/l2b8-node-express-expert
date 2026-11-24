import type { NextFunction, Request, Response } from "express";
import type { TRole } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { IUser } from "../modules/users/user.interface";

export const auth = (...roles: TRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).send({
          success: false,
          message: "Token Not Found",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string,
      ) as JwtPayload;

      const user = await pool.query(
        `
        SELECT * from users_practice WHERE email = $1
        `,
        [decoded?.email],
      );

      if (user.rowCount === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found.",
        });
      }
      // Check user is active or not
      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "User is not active.",
        });
      }

      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).send({
          success: false,
          message: "You are not authorized",
        });
      }

      req.user = decoded;

      next();
    } catch (err) {
      next(err);
    }
  };
};
