import _ from "lodash";
import dataSource from "../config/datasource.config";
import jwtHelper from "../helpers/jwt.helper";
import User from "../entities/user.entity";
import Company from "../entities/company.entity";
import UserRepository from "../repositories/user.repository";
import sessionRepo from "../repositories/session.repository";
import companyRepo from "../repositories/company.repository";
import { JwtPayload } from "jsonwebtoken";
import { QueryFailedError } from "typeorm";

const removeCredentials = (userObject: User) => {
  return _.omit(userObject, ["password", "salt", "deletedAt"]);
};

export default class AuthService {
  static register = async (
    email: string,
    password: string,
    company: string
  ) => {
    try {
      const newUser = new User(email);
      newUser.hashPassword(password);

      const foundCompany = await companyRepo.findOne({
        where: { name: company },
      });
      const savedUser = await dataSource.transaction(
        async (transactionalEM) => {
          if (!foundCompany) {
            const savedCompany = await transactionalEM
              .getRepository(Company)
              .save(new Company(company));
            newUser.company = <Company>(
              _.omit(savedCompany, ["deletedAt", "createdAt", "updatedAt"])
            );
          } else {
            newUser.company = <Company>(
              _.omit(foundCompany, ["deletedAt", "createdAt", "updatedAt"])
            );
          }
          const savedUser = await transactionalEM
            .withRepository(UserRepository)
            .save(newUser);

          _.set(
            savedUser,
            "authToken",
            await jwtHelper.signJwt(savedUser.id, savedUser.email)
          );
          return removeCredentials(savedUser);
        }
      );

      return savedUser;
    } catch (err: any) {
      if (
        err instanceof QueryFailedError &&
        err.driverError.code === "23505" &&
        err.driverError.table === "user"
      ) {
        throw new Error("An user with this email already exists.");
      }
      throw new Error(err.message);
    }
  };

  static login = async (email: string, password: string) => {
    try {
      const user = await UserRepository.findUserByEmailWithCompany(email);
      if (!user || user.deletedAt) {
        throw new Error("User not found.");
      }
      if (!user.checkPassword(password)) {
        throw new Error("Invalid credentials.");
      }
      _.set(user, "authToken", await jwtHelper.signJwt(user.id, user.email));
      return removeCredentials(user);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  static logout = async (jwtPayload: JwtPayload) => {
    try {
      const session = await sessionRepo.findOneOrFail({
        where: { sessionId: jwtPayload.sessionId },
      });

      if (!session) throw new Error("Session not found.");
      await sessionRepo.remove(session);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };
}
