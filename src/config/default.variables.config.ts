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
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    ssl: {
      rejectUnauthorized: false
    },
    entities: [__dirname + "/../entities/*.entity.{ts,js}"]
  };

const config = {
    server: SERVER,
    ormConfig: ORM_CONFIG,
    jwtSecret: JWT_SECRET
};

export default config;