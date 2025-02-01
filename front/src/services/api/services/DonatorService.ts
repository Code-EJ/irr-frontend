import BaseService from "../BaseService";
import { Donator } from "../Entities";

class DonatorService extends BaseService<Donator> {
  constructor() {
    super("doadores");
  }
}

export default new DonatorService();