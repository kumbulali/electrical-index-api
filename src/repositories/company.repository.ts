import dataSource from "../config/datasource.config";
import Company from "../entities/company.entity";

const companyRepo = dataSource.getRepository(Company);

export default companyRepo;