import { NextFunction, Request, Response } from "express";
import jwtHelper from "../helpers/jwt.helper";
import dataSource from "../config/datasource.config";
import { Session } from "../entities/session.entity";

const sessionRepo = dataSource.getRepository(Session);

const authorizationCheckerMiddleware = {
    checkJwt: async (req: Request, res: Response, next: NextFunction) => {

        try{
            const jwtPayload = <any>jwtHelper.getPayloadFromReq(req);
            const userSession = await sessionRepo.findOne({ where: { userId: jwtPayload.id }});
            if(!userSession || (userSession.id !== jwtPayload.sessionId)){

            }
        }catch (err){
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
};

export default authorizationCheckerMiddleware;