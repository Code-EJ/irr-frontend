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

  async update(p0: string, p1: { data: Date; tipo: "TOTAL" | "PARCIAL"; tipoOrigem: "DOACAO" | "COLETA"; tipoDestino: "DOACAO" | "COLETA"; volumeTotal: number; volumeRejeito: number; subtipologiaId: string; }, data: Partial<E>): Promise<E | undefined> {
    const res = await apiClient.patch(`/${this.route}/${data.id}`, data);

    if (res.status === 200 || res.status === 201) {
      return res.data;
    }
  }
}

export default BaseService;