import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  // if pass all then generate jwt token

  const { email, password } = payload;

  // Check if user exists
  const user = await pool.query(
    `
    SELECT * FROM users WHERE email = $1
    `,
    [email],
  );

  if (user.rowCount === 0) {
    throw new Error("Invalid Credentials");
  }

  // Check if password matched
  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  // Check user status
  if (user.rows[0].is_active === false) {
    throw new Error("Access denied!");
  }

  // Create JWT Access Token
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1d",
  });

  delete user.rows[0].password;

  return { accessToken, user: user.rows[0] };
};

export const authService = {
  loginUserIntoDB,
};
