import ConsumptionRepository from "../repositories/consumption.repository";
import _ from "lodash";
import UserRepository from "../repositories/user.repository";
import { Between, EntityNotFoundError } from "typeorm";

export default class ConsumptionService {
  static getAllConsumptions = async (userId: number) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId);
      const foundConsumptiones = await ConsumptionRepository.find({
        where: { company: reqUser.company },
        order: { date: "ASC" },
      });
      return _.map(foundConsumptiones, (consumption) => {
        return _.omit(consumption, ["createdAt", "updatedAt"]);
      });
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        throw new Error("Consumption not found.");
      }
      throw new Error(err.message);
    }
  };

  static getConsumptionByDate = async (date: Date, userId: number) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId);
      const foundConsumption = await ConsumptionRepository.findOneOrFail({
        where: { date: date, company: reqUser.company },
      });
      return _.omit(foundConsumption, ["createdAt", "updatedAt"]);
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        throw new Error("Consumption not found.");
      }
      throw new Error(err.message);
    }
  };

  static getConsumptionsBetweenDates = async (
    date1: Date,
    date2: Date,
    userId: number
  ) => {
    try {
      const reqUser = await UserRepository.findUserByIdWithCompany(userId);
      const foundConsumptiones = await ConsumptionRepository.find({
        where: { company: reqUser.company, date: Between(date1, date2) },
        order: { date: "ASC" },
      });
      return _.map(foundConsumptiones, (consumption) => {
        return _.omit(consumption, ["createdAt", "updatedAt"]);
      });
    } catch (err: any) {
      if (err instanceof EntityNotFoundError) {
        throw new Error("Consumption not found.");
      }
      throw new Error(err.message);
    }
  };
}
