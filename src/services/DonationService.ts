import BaseService from "../bases/BaseService";
import { Donation } from "../models/Entities";

class DonationService extends BaseService<Donation> {
  constructor() {
    super("doacoes");
  }
}

export default new DonationService();