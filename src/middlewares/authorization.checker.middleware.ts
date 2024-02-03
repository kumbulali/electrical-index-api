import { NextFunction, Request, Response } from "express";
import jwtHelper from "../helpers/jwt.helper";
import sessionRepo from "../repositories/session.repository";
import { JwtPayload } from "jsonwebtoken";

export default class AuthorizationCheckerMiddleware {
    static checkJwt = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const jwtPayload = <JwtPayload>jwtHelper.getPayloadFromReq(req);            
            const userSession = await sessionRepo.findOne({ where: { userId: jwtPayload.id }});
            if(!userSession || (userSession.sessionId !== jwtPayload.sessionId)){
                throw new Error('Unauthorized');
            }
            next();
        }catch (err: any){
            res.status(401).json({
                message: 'Unauthorized'
            });
        }
    }
};
