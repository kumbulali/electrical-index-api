import IndexRepository from "../repositories/index.repository";
import Index from "../entities/index.entity";
import _ from "lodash";
import UserRepository from "../repositories/user.repository";
import {
  EntityNotFoundError,
  LessThanOrEqual,
  MoreThanOrEqual,
  QueryFailedError,
} from "typeorm";
import Consumption from "../entities/consumption.entity";
import dataSource from "../config/datasource.config";
import ConsumptionRepository from "../repositories/consumption.repository";

export default class IndexService {
  static addIndex = async (date: Date, indexValue: number, userId: number) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId);
      const neighboringIndexes = await IndexRepository.getNeighboringIndexes(
        date,
        reqUser.company
      );

      if (
        neighboringIndexes.previousIndex &&
        neighboringIndexes.previousIndex.value > indexValue
      ) {
        throw new Error(
          "Index values must be greater than or equal to the nearest previous value entered."
        );
      }
      if (
        neighboringIndexes.nextIndex &&
        neighboringIndexes.nextIndex.value < indexValue
      ) {
        throw new Error(
          "Index values must be less than or equal to the nearest next value entered."
        );
      }
      const newIndex = new Index(indexValue, date, reqUser.company);

      var consumptions: Consumption[] = [];
      if (neighboringIndexes.previousIndex) {
        const previousConsumptions = Index.calculateAverageDailyConsumption(
          neighboringIndexes.previousIndex,
          newIndex
        );
        consumptions = consumptions.concat(previousConsumptions);
      }
      if (neighboringIndexes.nextIndex) {
        const nextConsumptions = Index.calculateAverageDailyConsumption(
          newIndex,
          neighboringIndexes.nextIndex
        );
        consumptions = consumptions.concat(nextConsumptions);
      }

      const savedIndex = await dataSource.transaction(
        async (transactionalEM) => {
          await transactionalEM
            .withRepository(ConsumptionRepository)
            .saveConsumptions(consumptions, reqUser.company);
          return await transactionalEM.getRepository(Index).save(newIndex);
        }
      );
      return _.omit(savedIndex, ["deletedAt", "createdAt", "updatedAt"]);
    } catch (err: any) {
      if (
        err instanceof QueryFailedError &&
        err.driverError.code === "23505" &&
        err.driverError.table === "index"
      ) {
        throw new Error("An index with this date already exists.");
      }
      throw new Error(err.message);
    }
  };

  static updateIndex = async (date: Date, newValue: number, userId: number) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId),
        foundIndex = await IndexRepository.findOneOrFail({
          where: { date: date, company: reqUser.company },
          relations: ["company"],
        }),
        neighboringIndexes = await IndexRepository.getNeighboringIndexes(
          date,
          reqUser.company
        );

      if (
        neighboringIndexes.previousIndex &&
        neighboringIndexes.previousIndex.value > newValue
      ) {
        throw new Error(
          "Index values must be greater than or equal to the nearest previous value entered."
        );
      }
      if (
        neighboringIndexes.nextIndex &&
        neighboringIndexes.nextIndex.value < newValue
      ) {
        throw new Error(
          "Index values must be less than or equal to the nearest next value entered."
        );
      }

      foundIndex.value = newValue;

      var consumptions: Consumption[] = [];
      if (neighboringIndexes.previousIndex) {
        const previousConsumptions = Index.calculateAverageDailyConsumption(
          neighboringIndexes.previousIndex,
          foundIndex
        );
        consumptions = consumptions.concat(previousConsumptions);
      }
      if (neighboringIndexes.nextIndex) {
        const nextConsumptions = Index.calculateAverageDailyConsumption(
          foundIndex,
          neighboringIndexes.nextIndex
        );
        consumptions = consumptions.concat(nextConsumptions);
      }

      const updatedIndex = await dataSource.transaction(
        async (transactionalEM) => {
          await transactionalEM
            .withRepository(ConsumptionRepository)
            .saveConsumptions(consumptions, reqUser.company);
          return await transactionalEM.getRepository(Index).save(foundIndex);
        }
      );
      return _.omit(updatedIndex, ["deletedAt", "createdAt", "updatedAt"]);
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        throw new Error("Index not found.");
      }
      throw new Error(err.message);
    }
  };

  static deleteIndex = async (date: Date, userId: number) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId),
        foundIndex = await IndexRepository.findOneOrFail({
          where: { date: date, company: reqUser.company },
        }),
        neighboringIndexes = await IndexRepository.getNeighboringIndexes(
          date,
          reqUser.company
        );

      if (neighboringIndexes.previousIndex && neighboringIndexes.nextIndex) {
        const consumptions = Index.calculateAverageDailyConsumption(
          neighboringIndexes.previousIndex,
          neighboringIndexes.nextIndex
        );
        await dataSource.transaction(async (transactionalEM) => {
          await transactionalEM
            .withRepository(ConsumptionRepository)
            .saveConsumptions(consumptions, reqUser.company);
          await transactionalEM.getRepository(Index).remove(foundIndex);
        });
      }
      if (!neighboringIndexes.nextIndex && neighboringIndexes.previousIndex) {
        await dataSource.transaction(async (transactionalEM) => {
          await transactionalEM.withRepository(ConsumptionRepository).delete({
            company: reqUser.company,
            date: MoreThanOrEqual(neighboringIndexes.previousIndex!.date),
          });
          await transactionalEM.getRepository(Index).remove(foundIndex);
        });
      }
      if (!neighboringIndexes.previousIndex && neighboringIndexes.nextIndex) {
        await dataSource.transaction(async (transactionalEM) => {
          await transactionalEM.withRepository(ConsumptionRepository).delete({
            company: reqUser.company,
            date: LessThanOrEqual(neighboringIndexes.nextIndex!.date),
          });
          await transactionalEM.getRepository(Index).remove(foundIndex);
        });
      }
      if (!neighboringIndexes.nextIndex && !neighboringIndexes.previousIndex) {
        await IndexRepository.remove(foundIndex);
      }
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        throw new Error("Index not found.");
      }
      throw new Error(err.message);
    }
  };
}
