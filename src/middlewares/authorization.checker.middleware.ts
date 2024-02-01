import { NextFunction, Request, Response } from "express";
import jwtHelper from "../helpers/jwt.helper";
import dataSource from "../config/datasource.config";
import { Session } from "../entities/session.entity";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

const sessionRepo = dataSource.getRepository(Session);

const authorizationCheckerMiddleware = {
    checkJwt: async (req: Request, res: Response, next: NextFunction) => {

        try{
            const jwtPayload = <JwtPayload>jwtHelper.getPayloadFromReq(req);            
            const userSession = await sessionRepo.findOne({ where: { userId: jwtPayload.id }});
            if(!userSession || (userSession.sessionId !== jwtPayload.sessionId)){
                throw new Error('Unauthorized');
            }
            next();
        }catch (err){
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
};

export default authorizationCheckerMiddleware;