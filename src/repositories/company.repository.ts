import dataSource from "../config/datasource.config";
import Company from "../entities/company.entity";

const CompanyRepository = dataSource.getRepository(Company)

export default CompanyRepository;