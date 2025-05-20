import BaseService from "../bases/BaseService";
import { InputMaterial } from "../models/Entities";

class InputMaterialService extends BaseService<InputMaterial> {
  constructor() {
    super("materialEntrada");
  }
}

export default new InputMaterialService();