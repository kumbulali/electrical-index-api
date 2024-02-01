import express from "express";
import authController from "../controllers/auth.controller";
import authorizationCheckerMiddleware from "../middlewares/authorization.checker.middleware";

const authRoute = express.Router();

authRoute.post('/login', authController.login);

authRoute.post('/register', authController.register);

authRoute.get('/logout', [authorizationCheckerMiddleware.checkJwt], authController.logout);

export default authRoute;