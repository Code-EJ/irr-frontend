import BaseService from "../bases/BaseService";
import { Sale } from "../models/Entities";

class SaleService extends BaseService<Sale> {
  constructor() {
    super("vendas");
  }
}

export default new SaleService();