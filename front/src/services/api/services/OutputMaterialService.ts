import BaseService from "../BaseService";
import { OutputMaterial } from "../Entities";

class OutputMaterialService extends BaseService<OutputMaterial> {
  constructor() {
    super("material-saida");
  }
}

export default new OutputMaterialService();