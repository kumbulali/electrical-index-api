import { DataSource } from "typeorm";
import { ORM_CONFIG } from "./config";

const dataSource = new DataSource(ORM_CONFIG);

export default dataSource;