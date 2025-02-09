import BaseService from "../BaseService";
import { Driver } from "../Entities";

class DriverService extends BaseService<Driver> {
  constructor() {
    super("motoristas");
  }
}

export default new DriverService();