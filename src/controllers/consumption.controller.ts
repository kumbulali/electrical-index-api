import { Request, Response } from "express";
import consumptionService from "../services/consumption.service";
import jwtHelper from "../helpers/jwt.helper";

export default class ConsumptionController {
  static getAllConsumptions = async (req: Request, res: Response) => {
    try {
      const { id } = jwtHelper.getPayloadFromReq(req);
      const consumptions = await consumptionService.getAllConsumptions(id);
      res.status(200).send(consumptions);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  static getConsumptionByDate = async (req: Request, res: Response) => {
    try {
      const { id } = jwtHelper.getPayloadFromReq(req);
      const { consumptionDate } = req.params;
      const consumption = await consumptionService.getConsumptionByDate(
        new Date(consumptionDate),
        id
      );
      res.status(200).send(consumption);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  static getConsumptionsBetweenDates = async (req: Request, res: Response) => {
    try {
      const { id } = jwtHelper.getPayloadFromReq(req);
      const { consumptionDate1, consumptionDate2 } = req.params;
      const consumption = await consumptionService.getConsumptionsBetweenDates(
        new Date(consumptionDate1),
        new Date(consumptionDate2),
        id
      );
      res.status(200).send(consumption);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };
}
