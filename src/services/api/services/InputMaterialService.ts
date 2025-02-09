import BaseService from "../BaseService";
import { InputMaterial } from "../Entities";

class InputMaterialService extends BaseService<InputMaterial> {
  constructor() {
    super("material-entrada");
  }
}

export default new InputMaterialService();