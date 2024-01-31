import CryptoJS from "crypto-js";
import * as jwt from "jsonwebtoken";
import config from "../config/default.variables.config";
import { Request } from "express";
import dataSource from "../config/datasource.config";
import { Session } from "../entities/session.entity";

const sessionRepo = dataSource.getRepository(Session);

const jwtHelper = {
  signJwt: async (id: number, email: string) => {
    const payload = {
      id: id,
      email: email,
      sessionId: CryptoJS.lib.WordArray.random(8).toString(CryptoJS.enc.Hex),
    };

    const userSession = await sessionRepo.findOne({ where: { userId: id }});

    if(userSession){
        userSession.sessionId = payload.sessionId;
        await sessionRepo.save(userSession);
    }else{
        const newSession = new Session();
        newSession.sessionId = payload.sessionId;
        newSession.userId = payload.id;

        await sessionRepo.save(newSession)
    }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });

    return token;
  },

  getPayloadFromReq: async (req: Request) => {
    const token = <string>req.headers["authorization"];
    const bearerToken = token.slice(7);
    return jwt.verify(bearerToken, config.jwtSecret);
  },
};

export default jwtHelper;
