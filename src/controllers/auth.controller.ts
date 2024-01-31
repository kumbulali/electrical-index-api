import authService from "../services/auth.service";
import { Request, Response } from "express";
import authValidation from "../validations/auth.validation";

const authController = {
  register: async (req: Request, res: Response) => {
    try {
        const { error } = authValidation.registerValidationSchema.validate(req.body);
        const { email, password, company } = req.body;
        if (error)
            throw error;
        const user = await authService.register(email, password, company);
        res.send(user);
    } catch (error) {
        res.status(400).send({
            message: error
        });
    }
  },

  login: async (req: Request, res: Response) => {},
};

export default authController;
