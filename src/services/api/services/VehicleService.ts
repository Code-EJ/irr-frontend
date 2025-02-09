import BaseService from "../BaseService";
import { Vehicle } from "../Entities";

class VehicleService extends BaseService<Vehicle> {
  constructor() {
    super("veiculos");
  }
}

export default new VehicleService();