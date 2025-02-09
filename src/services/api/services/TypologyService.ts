import BaseService from "../BaseService";
import { Typology } from "../Entities";

class TypologyService extends BaseService<Typology> {
  constructor() {
    super("tipologias");
  }
}
export default new TypologyService();