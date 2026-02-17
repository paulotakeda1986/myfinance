import api from "./api";

export interface Carteira {
  id: number;
  nome: string;
  bancoId?: number;
  bancoNome?: string;
  tipoCarteiraId: number;
  tipoCarteiraNome?: string;
  saldoInicial: number;
  saldoAtual: number;
}

export interface CreateCarteiraRequest {
  nome: string;
  bancoId?: number;
  tipoCarteiraId: number;
  saldoInicial: number;
}

export interface UpdateCarteiraRequest {
  nome: string;
  bancoId?: number;
  tipoCarteiraId: number;
}

export const walletService = {
  getAll: async () => {
    const response = await api.get<Carteira[]>("/carteira");
    return response.data;
  },
  create: async (data: CreateCarteiraRequest) => {
    const response = await api.post<Carteira>("/carteira", data);
    return response.data;
  },
  update: async (id: number, data: UpdateCarteiraRequest) => {
    await api.put(`/carteira/${id}`, data);
  },
  delete: async (id: number) => {
    await api.delete(`/carteira/${id}`);
  },
};
