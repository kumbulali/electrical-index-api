import dataSource from "../config/datasource.config";
import Index from "../entities/index.entity";

const indexRepo = dataSource.getRepository(Index);

export default indexRepo;