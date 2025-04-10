import BaseService from "../bases/BaseService";
import { User } from "../models/Entities";

class UserService extends BaseService<User> {
  constructor() {
    super("usuarios");
  }
}

export default new UserService();