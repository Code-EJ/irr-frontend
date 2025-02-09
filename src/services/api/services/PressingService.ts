import BaseService from "../BaseService";
import { Pressing } from "../Entities";

class PressingService extends BaseService<Pressing> {
  constructor() {
    super("prensagem");
  }
}
export default new PressingService();