import { apiClient } from "./Client";

class BaseService<E> {
  private route: string;

  constructor(route: string) {
    this.route = route;
  }

  async create(data: Partial<E>): Promise<E | number> {
    const res = await apiClient.post(`/${this.route}`, data);

    if (res.status === 200 || res.status === 201) {
      return res.data;
    }

    return res.status;
  }

  async get(id: string): Promise<E | number> {
    const res = await apiClient.get(`/${this.route}/${id}`);

    if (res.status === 200) {
      return res.data;
    }

    return res.status;
  }

  async getAll(): Promise<E[] | number> {
    const res = await apiClient.get(`/${this.route}`);

    if (res.status === 200) {
      return res.data;
    }

    return res.status;
  }

  async delete(id: string): Promise<E | number> {
    const res = await apiClient.delete(`/${this.route}/${id}`);
  
    if (res.status === 200) {
      return res.data;
    }

    return res.status;
  }
}

export default BaseService;