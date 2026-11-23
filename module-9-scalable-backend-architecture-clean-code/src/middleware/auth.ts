import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      // Check if the token exists
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access token not found.",
        });
      }
      //Decode Access Token
      const decode = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;

      //Check that user is exists or not in database
      const user = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
    `,
        [decode.email],
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

      // roles = ["admin", "agent", "user"]
      // user.role = "admin" or "user" or "agent"
      // Check user role get from decoded user in matched or not with roles come from router inside auth("admin", "agent")
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "You are not Authorized.",
        });
      }

      // inject decoded user inside req
      req.user = decode;

      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
