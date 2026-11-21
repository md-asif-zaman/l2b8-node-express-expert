import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  database_url: process.env.DATABASE_URL,
  port: process.env.PORT,
  bcrypt_salt: process.env.BCRYPT_SALT,
};

export default config;
