import BaseService from "../BaseService";
import { SubTypology } from "../Entities";

class SubTypologyService extends BaseService<SubTypology> {
  constructor() {
    super("subtipologias");
  }
}
export default new SubTypologyService();