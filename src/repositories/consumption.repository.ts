import { In } from "typeorm";
import dataSource from "../config/datasource.config";
import Consumption from "../entities/consumption.entity";
import Company from "../entities/company.entity";

const ConsumptionRepository = dataSource.getRepository(Consumption).extend({
  async updateConsumption(consumptionDate: Date, newValue: number) {
    const foundConsumption = await this.findOneOrFail({
      where: { date: consumptionDate },
    });
    foundConsumption.value = newValue;
    await this.save(foundConsumption);
    return foundConsumption;
  },

  async saveConsumptions(consumptions: Consumption[], company: Company) {
    const existingConsumptions = await this.find({
      where: { date: In(consumptions.map((c) => c.date)), company: company },
    });
    
    const updates = [];
    const newConsumptions = [];

    for (const consumption of consumptions) {
      const existingConsumption = existingConsumptions.find(
        (c) => new Date(c.date).getDate() === new Date(consumption.date).getDate()
      );
    
      if (existingConsumption) {
        existingConsumption.value = consumption.value;

        updates.push(existingConsumption);
      } else {
        newConsumptions.push(consumption);
      }
    }

    await Promise.all([this.save(updates), this.save(newConsumptions)]);
  }
});

export default ConsumptionRepository;