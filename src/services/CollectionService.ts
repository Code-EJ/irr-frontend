import BaseService from "../bases/BaseService";
import { Collection } from "../models/Entities";

class CollectionService extends BaseService<Collection> {
  constructor() {
    super("coletas");
  }
}

export default new CollectionService();