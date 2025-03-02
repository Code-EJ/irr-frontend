import BaseService from "../bases/BaseService";
import { Triage } from "../models/Entities";

class TriageService extends BaseService<Triage> {
  constructor() {
    super("triagem");
  }
}
export default new TriageService();