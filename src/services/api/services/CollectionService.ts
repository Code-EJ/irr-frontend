import BaseService from "../BaseService";
import { Vehicle } from "../Entities";

class CollectionService extends BaseService<Vehicle> {
  constructor() {
    super("veiculos");
  }
}

export default new CollectionService();