import BaseService from "../bases/BaseService";
import { User } from "../models/Entities";

class DonationService extends BaseService<User> {
  constructor() {
    super("usuarios");
  }
}

export default new DonationService();