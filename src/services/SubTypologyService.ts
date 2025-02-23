import BaseService from "../bases/BaseService";
import { SubTypology } from "../models/Entities";


class SubTypologyService extends BaseService<SubTypology> {
  constructor() {
    super("subtipologias");
  }
}
export default new SubTypologyService();