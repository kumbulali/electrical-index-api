import express from "express";
import IndexController from "../controllers/index.controller";
import AuthorizationCheckerMiddleware from "../middlewares/authorization.checker.middleware";

const indexRoute = express.Router();

indexRoute.post('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.addIndex);

indexRoute.delete('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.deleteIndexByDate);

indexRoute.delete('/:indexId', [AuthorizationCheckerMiddleware.checkJwt], IndexController.deleteIndexById);

export default indexRoute;