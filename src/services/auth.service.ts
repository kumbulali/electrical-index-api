import _ from "lodash";
import dataSource from "../config/datasource.config";
import jwtHelper from "../helpers/jwt.helper";
import User from "../entities/user.entity";
import Company from "../entities/company.entity";
import JwtPayload from "../interfaces/jwtPayload.interface";
import userRepo from "../repositories/user.repository";
import sessionRepo from "../repositories/session.repository";
import companyRepo from "../repositories/company.repository";

const removeCredentials = (userObject: User) => {
  return _.omit(userObject, ["password", "salt", "deletedAt"]);
};

export default class AuthService {
  static register = async (email: string, password: string, company: string) => {
    const newUser = new User();

    
    const foundCompany = await companyRepo.findOne({ where: { name: company } });
    if(!foundCompany){
      const foundCompany = new Company();
      foundCompany.name = company;
    }
    newUser.hashPassword(password);
    newUser.email = email;

    try {
      return await dataSource.transaction(async transactionalEM => {
        const savedCompany = await transactionalEM.save(foundCompany);
        newUser.company = <Company>_.omit(savedCompany, ['deletedAt', 'createdAt', 'updatedAt']);
        const savedUser = await transactionalEM.save(newUser);

        _.set(
          savedUser,
          "authToken",
          await jwtHelper.signJwt(savedUser.id, savedUser.email)
        );
        return removeCredentials(savedUser);
      })
    } catch (err: any) {
      throw err.message;
    }
  };

  static login = async (email: string, password: string) => {
    const user = await userRepo.createQueryBuilder('user')
    .leftJoin('user.company', 'company')
    .select(['user', 'company.id', 'company.name'])
    .where('user.email = :email', { email: email })
    .getOne();
    
    if (!user || user.deletedAt) {
      throw new Error("User not found.");
    }
    
    if (!user.checkPassword(password)) {
      throw new Error("Invalid credentials.");
    }

    _.set(user, "authToken", await jwtHelper.signJwt(user.id, user.email));

    return removeCredentials(user);
  };

  static logout = async (jwtPayload: JwtPayload) => {
    const session = await sessionRepo.findOneOrFail({
      where: { sessionId: jwtPayload.sessionId },
    });
    
    if (!session) throw new Error("Session not found.");

    try {
      await sessionRepo.remove(session);
    } catch (err: any) {
      throw err.message;
    }
  };
};
