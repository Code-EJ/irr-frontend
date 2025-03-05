import BaseService from "../bases/BaseService";
import { InputMaterial } from "../models/Entities";

class InputMaterialService extends BaseService<InputMaterial> {
  constructor() {
    super("material-entrada");
  }
}

export default new InputMaterialService();