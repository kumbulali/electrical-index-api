import dataSource from "../config/datasource.config";
import User from "../entities/user.entity";

const UserRepository = dataSource.getRepository(User).extend({
  async findUserByIdWithCompany(userId: number) {
    const user = await this.createQueryBuilder("user")
      .leftJoinAndSelect("user.company", "company")
      .select(["user.id", "user.email", "company.id", "company.name"])
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
});

export default UserRepository;
