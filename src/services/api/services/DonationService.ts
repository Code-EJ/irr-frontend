import BaseService from "../BaseService";
import { Donation } from "../Entities";

class DonationService extends BaseService<Donation> {
  constructor() {
    super("doacoes");
  }
}

export default new DonationService();