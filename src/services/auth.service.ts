import _ from "lodash";
import dataSource from "../config/datasource.config";
import { Company } from "../entities/company.entity";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcrypt";
import jwtHelper from "../helpers/jwt.helper";

const removeCredentials = (userObject: User) => {
    return _.omit(userObject, ['password', 'salt', 'deletedAt']);
};

const authService = {
    async register(email: string, password: string, company: Company){
        const newUser = new User(),
            userRepo = dataSource.getRepository(User);

        newUser.hashPassword(password);
        newUser.email = email;
        newUser.company = company;

        try{
            const savedUser = await userRepo.save(newUser);
            _.set(savedUser, 'authToken', await jwtHelper.signJwt(savedUser.id, savedUser.email));
            return removeCredentials(savedUser);
        }catch(err){
            throw err
        }

    },
    async login(req: Request, res: Response){

    }
}

export default authService;