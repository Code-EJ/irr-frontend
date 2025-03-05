import BaseService from "../bases/BaseService";
import { Vehicle } from "../models/Entities";

class CollectionService extends BaseService<Vehicle> {
  constructor() {
    super("veiculos");
  }
}

export default new CollectionService();