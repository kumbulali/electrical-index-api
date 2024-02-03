import express from "express";
import IndexController from "../controllers/index.controller";
import AuthorizationCheckerMiddleware from "../middlewares/authorization.checker.middleware";

const indexRoute = express.Router();

indexRoute.get('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.getAllIndexes);

indexRoute.get('/:indexDate', [AuthorizationCheckerMiddleware.checkJwt], IndexController.getIndexByDate);

indexRoute.post('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.addIndex);

indexRoute.patch('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.updateIndex);

indexRoute.delete('/', [AuthorizationCheckerMiddleware.checkJwt], IndexController.deleteIndex);

export default indexRoute;