import BaseService from "../bases/BaseService";
import { Media } from "../models/Entities";

class MediaService extends BaseService<Media> {
  constructor() {
    super("media");
  }
}

export default new MediaService();