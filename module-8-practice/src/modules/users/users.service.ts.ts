import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser } from "./user.interface";
import config from "../../config";

const createUserIntoDB = async (payload: IUser) => {
  const { name, age, email, password } = payload;

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt),
  );

  const result = await pool.query(
    `
        INSERT INTO users_practice(name, age, email, password) VALUES($1, $2, $3, $4) RETURNING *
    `,
    [name, age, email, hashedPassword],
  );

  delete result.rows[0].password;

  if (result.rowCount == 0) {
    throw Error("Can not create user");
  }

  return result.rows[0];
};

const getUsersFromDB = async () => {
  const result = await pool.query(`
    SELECT * FROM users_practice
    `);
  return result.rows;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users_practice WHERE id = $1
    `,
    [id],
  );

  if (result.rowCount == 0) {
    throw Error("User not found.");
  }
  delete result.rows[0].password;
  return result.rows[0];
};

const deleteUserFromDB = async (id: string) => {
  const userExistance = await pool.query(
    `
    SELECT * FROM users_practice WHERE id = $1
    `,
    [id],
  );

  if (userExistance.rowCount == 0) {
    throw Error("User not found.");
  }

  await pool.query(
    `
    DELETE FROM users_practice WHERE id = $1
    `,
    [id],
  );
};

export const userServices = {
  createUserIntoDB,
  getUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
};
