import { LessThan } from "typeorm";
import indexRepo from "../repositories/index.repository";
import Index from "../entities/index.entity";
import _ from "lodash";

const getPreviousIndex = async (date: Date) => {
    const previousIndex = await indexRepo.findOne({
        where: {
          date: LessThan(date) 
        },
        order: {
          date: 'DESC'
        }
      });
    
      if(!previousIndex) {
        throw new Error("No previous index found");
      }
    
      return previousIndex;
};

export default class IndexService {
  static addIndex = async (date: Date, indexValue: number, userId: number) => {
    try{
        const newIndex = new Index();
        newIndex.date = date;
        newIndex.value = indexValue;
        const savedIndex = await indexRepo.save(newIndex);
        return _.omit(savedIndex, ['deletedAt']);
    }catch(err: any){
        throw new Error(err.message);
    }
  };

  static deleteIndexByDate = async (date: Date) => {
    console.log(date);
    return;
  };

  static deleteIndexById = async (indexId: number) => {
    console.log(indexId);
    return;
  };
};