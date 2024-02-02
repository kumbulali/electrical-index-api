import dataSource from "../config/datasource.config";
import Session from "../entities/session.entity";

const sessionRepo = dataSource.getRepository(Session);

export default sessionRepo;