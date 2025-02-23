import BaseService from "../bases/BaseService";
import { Vehicle } from "../models/Entities";


class VehicleService extends BaseService<Vehicle> {
  constructor() {
    super("veiculos");
  }
}

export default new VehicleService();