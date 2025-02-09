import BaseService from "../BaseService";
import { Triage } from "../Entities";

class TriageService extends BaseService<Triage> {
  constructor() {
    super("triagem");
  }
}
export default new TriageService();