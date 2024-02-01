import _ from "lodash";
import dataSource from "../config/datasource.config";
import { Company } from "../entities/company.entity";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import jwtHelper from "../helpers/jwt.helper";
import { Session } from "../entities/session.entity";
import { JwtPayload } from "../interfaces/jwtPayload.interface";

const removeCredentials = (userObject: User) => {
  return _.omit(userObject, ["password", "salt", "deletedAt"]);
};

const userRepo = dataSource.getRepository(User),
  sessionRepo = dataSource.getRepository(Session);

const authService = {
  async register(email: string, password: string, company: Company) {
    const newUser = new User();

    newUser.hashPassword(password);
    newUser.email = email;
    newUser.company = company;

    try {
      const savedUser = await userRepo.save(newUser);
      _.set(
        savedUser,
        "authToken",
        await jwtHelper.signJwt(savedUser.id, savedUser.email)
      );
      return removeCredentials(savedUser);
    } catch (err) {
      throw err;
    }
  },
  async login(email: string, password: string) {
    const user = await userRepo.findOne({ where: { email: email } });

    if (!user || user.deletedAt) {
      throw new Error("User not found.");
    }

    if (!user.checkPassword(password)) {
      throw new Error("Invalid credentials.");
    }

    _.set(user, "authToken", await jwtHelper.signJwt(user.id, user.email));

    return removeCredentials(user);
  },

  async logout(jwtPayload: JwtPayload) {
    const session = await sessionRepo.findOneOrFail({
      where: { sessionId: jwtPayload.sessionId },
    });
    
    if (!session) throw new Error("Session not found.");

    try {
      await sessionRepo.remove(session);
    } catch (error) {
      throw error;
    }
  },
};

export default authService;
