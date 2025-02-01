import BaseService from "../BaseService";
import { Sale } from "../Entities";

class SaleService extends BaseService<Sale> {
  constructor() {
    super("vendas");
  }
}

export default new SaleService();