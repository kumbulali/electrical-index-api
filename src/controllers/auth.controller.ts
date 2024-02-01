import authService from "../services/auth.service";
import { Request, Response } from "express";
import authValidation from "../validations/auth.validation";
import jwtHelper from "../helpers/jwt.helper";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { error } = authValidation.registerValidationSchema.validate(
        req.body
      );
      const { email, password, company } = req.body;
      if (error) throw error;
      const user = await authService.register(email, password, company);
      res.send(user);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { error } = authValidation.loginValidationSchema.validate(req.body);
      if (error) {
        throw error;
      }
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.status(200).send(user);
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const jwtPayload = jwtHelper.getPayloadFromReq(req);      
      await authService.logout(jwtPayload);
      res.status(200).send({
        message: "Successfully logged out.",
      });
    } catch (err: any) {
      res.status(400).send({
        message: err.message,
      });
    }
  },
};

export default authController;
