import BaseService from "../bases/BaseService";
import { Pressing } from "../models/Entities";


class PressingService extends BaseService<Pressing> {
  constructor() {
    super("prensagem");
  }
}
export default new PressingService();