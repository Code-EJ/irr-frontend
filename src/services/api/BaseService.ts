import { apiClient } from "./Client";
import { Model } from "./Entities";

class BaseService<E extends Model> {
  private route: string;

  constructor(route: string) {
    this.route = route;
  }

  async create(data: Partial<E>): Promise<E | undefined> {
    const res = await apiClient.post(`/${this.route}`, data);

    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
  }

  async get(id: string): Promise<E | undefined> {
    const res = await apiClient.get(`/${this.route}/${id}`);

    if (res.status === 200) {
      return res.data;
    }
  }

  async getAll(): Promise<E[] | undefined> {
    const res = await apiClient.get(`/${this.route}`);

    if (res.status === 200) {
      return res.data;
    }
  }

  async delete(id: string): Promise<E | undefined> {
    const res = await apiClient.delete(`/${this.route}/${id}`);
  
    if (res.status === 200) {
      return res.data;
    }
  }

  async update(data: Partial<E>): Promise<E | undefined> {
    const res = await apiClient.patch(`/${this.route}/${data.id}`, data);

    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
  }
}

export default BaseService;