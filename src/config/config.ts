import dotenv from "dotenv";
import { DataSourceOptions } from "typeorm/data-source/DataSourceOptions";

dotenv.config();

const HOSTNAME = process.env.HOSTNAME || "localhost";
const PORT = process.env.PORT || 3000;

export const JWT_SECRET = process.env.JWT_SECRET as string;

export const SERVER = {
  hostname: HOSTNAME,
  port: PORT,
};

export const ORM_CONFIG: DataSourceOptions = {
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT as string) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"]
  };

const config = {
    server: SERVER,
    ormConfig: ORM_CONFIG,
    jwtSecret: JWT_SECRET
};

export default config;