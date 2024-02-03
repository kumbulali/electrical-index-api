import { Request, Response } from "express";
import indexValidation from "../validations/index.validation";
import indexService from "../services/index.service";
import jwtHelper from "../helpers/jwt.helper";

export default class IndexController {
  static addIndex = async (req: Request, res: Response) => {
    try {
      const { error } = indexValidation.addIndexValidationSchema.validate(
        req.body
      );
      if (error) throw error;
      const { id } = jwtHelper.getPayloadFromReq(req);
      const { date, value } = req.body;
      const index = await indexService.addIndex(date, value, id);
      res.status(200).send(index);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  static updateIndex = async (req: Request, res: Response) => {
    try {
      const { error } = indexValidation.updateIndexValidationSchema.validate(
        req.body
      );
      if (error) throw error;
      const { id } = jwtHelper.getPayloadFromReq(req);
      const { date, newValue } = req.body;
      await indexService.updateIndex(date, newValue, id);
      res.status(200).send({
        message: "Index successfully updated.",
      });
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };

  static deleteIndex = async (req: Request, res: Response) => {
    try {
      const { error } = indexValidation.deleteIndexValidationSchema.validate(
        req.body
      );
      if (error) throw error;
      const { id } = jwtHelper.getPayloadFromReq(req);
      const { date } = req.body;
      await indexService.deleteIndex(date, id);
      res.status(200).send({
        message: "Index successfully deleted.",
      });
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  };
}
