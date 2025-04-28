import BaseService from "../bases/BaseService";
import { Document } from "../models/Entities";

class DocumentService extends BaseService<Document> {
  constructor() {
    super("documentos");
  }
}

export default new DocumentService();