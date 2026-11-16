import dotenv from "dotenv";
import path from "path";

// connect .env file with this config file
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const config = {
  port: Number(process.env.PORT),
};

export default config;
