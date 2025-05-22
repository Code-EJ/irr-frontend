import { apiClient } from "../config/security/Client";
import { Model } from "../models/Entities";

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

  async getAll(page: number | null, limit: number = 10): Promise<{ data: E[]; total: number } | undefined> {
    const params = page !== null ? { page, limit } : {};
    const res = await apiClient.get(`/${this.route}`, { params });

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

  async update(id: string, data: any): Promise<E | undefined> {
    const headers = data instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' };

    const res = await apiClient.patch(`/${this.route}/${id}`, data, { headers });

    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
  }
}

export default BaseService;