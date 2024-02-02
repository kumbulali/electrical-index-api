import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthorizationCheckerMiddleware from "../middlewares/authorization.checker.middleware";

const authRoute = express.Router();

authRoute.post('/login', AuthController.login);

authRoute.post('/register', AuthController.register);

authRoute.get('/logout', [AuthorizationCheckerMiddleware.checkJwt], AuthController.logout);

export default authRoute;