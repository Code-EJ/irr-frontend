import BaseService from "../bases/BaseService";
import { Typology } from "../models/Entities";


class TypologyService extends BaseService<Typology> {
  constructor() {
    super("tipologias");
  }
}
export default new TypologyService();