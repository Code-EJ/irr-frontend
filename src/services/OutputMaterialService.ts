import BaseService from "../bases/BaseService";
import { OutputMaterial } from "../models/Entities";


class OutputMaterialService extends BaseService<OutputMaterial> {
  constructor() {
    super("material-saida");
  }
}

export default new OutputMaterialService();