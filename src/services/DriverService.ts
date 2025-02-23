import BaseService from "../bases/BaseService";
import { Driver } from "../models/Entities";


class DriverService extends BaseService<Driver> {
  constructor() {
    super("motoristas");
  }
}

export default new DriverService();