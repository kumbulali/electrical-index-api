import express from "express";
import ConsumptionController from "../controllers/consumption.controller";
import AuthorizationCheckerMiddleware from "../middlewares/authorization.checker.middleware";

const consumptionRoute = express.Router();

consumptionRoute.get('/', [AuthorizationCheckerMiddleware.checkJwt], ConsumptionController.getAllConsumptions);

consumptionRoute.get('/:consumptionDate', [AuthorizationCheckerMiddleware.checkJwt], ConsumptionController.getConsumptionByDate);

consumptionRoute.get('/:consumptionDate1/:consumptionDate2', [AuthorizationCheckerMiddleware.checkJwt], ConsumptionController.getConsumptionsBetweenDates);

export default consumptionRoute;