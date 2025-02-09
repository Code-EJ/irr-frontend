import BaseService from "../BaseService";
import { User } from "../Entities";

class DonationService extends BaseService<User> {
  constructor() {
    super("usuarios");
  }
}

export default new DonationService();