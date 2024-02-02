import dataSource from "../config/datasource.config";
import User from "../entities/user.entity";

const userRepo = dataSource.getRepository(User);

export default userRepo;