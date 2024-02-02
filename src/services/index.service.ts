import indexRepo from "../repositories/index.repository";
import Index from "../entities/index.entity";
import _ from "lodash";
import userRepo from "../repositories/user.repository";
import User from "../entities/user.entity";
import { QueryFailedError } from "typeorm";
import Consumption from "../entities/consumption.entity";
import consumptionRepo from "../repositories/consumption.repository";

export default class IndexService {
  static addIndex = async (date: Date, indexValue: number, userId: number) => {
    try {
      const reqUser = await userRepo.findUserByIdWithCompany(userId);
      const neighboringIndexes = await indexRepo.getNeighboringIndexes(date, reqUser.company);

      if (neighboringIndexes.previousIndex && neighboringIndexes.previousIndex.value > indexValue){
        throw new Error('Index values must be greater than or equal to the nearest previous value entered.')
      }
      if (neighboringIndexes.nextIndex && neighboringIndexes.nextIndex.value < indexValue){
        throw new Error('Index values must be less than or equal to the nearest next value entered.')
      }
      const newIndex = new Index(indexValue, date, reqUser.company);
      const savedIndex = await indexRepo.save(newIndex);
      
      var consumptions: Consumption[] = []
      if(neighboringIndexes.previousIndex){
        const previousConsumptions = Index.calculateAverageDailyConsumption(neighboringIndexes.previousIndex, newIndex);
        consumptions = consumptions.concat(previousConsumptions);
      }
      if(neighboringIndexes.nextIndex){
        const nextConsumptions = Index.calculateAverageDailyConsumption(newIndex, neighboringIndexes.nextIndex);        
        var consumptions = consumptions.concat(nextConsumptions);
      }

      await consumptionRepo.saveConsumptions(consumptions, reqUser.company);
      return _.omit(savedIndex, ["deletedAt", "createdAt", "updatedAt"]);
    } catch (err: any) {
      if (err instanceof QueryFailedError && err.driverError.code === '23505' && err.driverError.table === 'index') {
        throw new Error('An index with this date already exists.')
      }
      throw new Error(err.message);
    }
  };

  static deleteIndexByDate = async (date: Date) => {
    console.log(date);
    return;
  };

  static deleteIndexById = async (indexId: number) => {
    console.log(indexId);
    return;
  };
}
