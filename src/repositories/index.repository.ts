import dataSource from "../config/datasource.config";
import Company from "../entities/company.entity";
import Index from "../entities/index.entity";

const IndexRepository = dataSource.getRepository(Index).extend({
  async getNeighboringIndexes(
    date: Date,
    company: Company
  ): Promise<{ previousIndex: Index | null; nextIndex: Index | null }> {
    const previousRow = await this.createQueryBuilder("index")
      .leftJoinAndSelect("index.company", "company")
      .where("index.date < :date", { date })
      .andWhere("index.companyId = :id", { id: company.id })
      .orderBy("index.date", "DESC")
      .getOne();

    const nextRow = await this.createQueryBuilder("index")
      .leftJoinAndSelect("index.company", "company")
      .where("index.date > :date", { date })
      .andWhere("index.companyId = :id", { id: company.id })
      .orderBy("index.date", "ASC")
      .getOne();

    return {
      previousIndex: previousRow,
      nextIndex: nextRow,
    };
  },
});

export default IndexRepository;
