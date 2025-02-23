import BaseService from "../bases/BaseService";
import { Donator } from "../models/Entities";


class DonatorService extends BaseService<Donator> {
  constructor() {
    super("doadores");
  }
}

export default new DonatorService();