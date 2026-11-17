import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL,
};

export default config;
