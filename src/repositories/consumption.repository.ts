import dataSource from "../config/datasource.config";
import Consumption from "../entities/consumption.entity";

const consumptionRepo = dataSource.getRepository(Consumption);

export default consumptionRepo;