import api from './api';

export interface CartaoCredito {
  id: number;
  nome: string;
  bancoId?: number;
  bancoNome?: string;
  carteiraId?: number;
  carteiraNome?: string;
  limiteTotal: number;
  limiteAtual: number;
  ativo: boolean;
  diaFechamentoFatura: number;
  diaVencimentoFatura: number;
}

export interface CreateCartaoCreditoRequest {
  nome: string;
  bancoId?: number;
  limiteTotal: number;
  carteiraId?: number;
  diaFechamentoFatura: number;
  diaVencimentoFatura: number;
}

export interface UpdateCartaoCreditoRequest {
  nome: string;
  bancoId?: number;
  limiteTotal: number;
  ativo: boolean;
  carteiraId?: number;
  diaFechamentoFatura: number;
  diaVencimentoFatura: number;
}

export const creditCardService = {
  getAll: async () => {
    const response = await api.get<CartaoCredito[]>('/CartaoCredito');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<CartaoCredito>(`/CartaoCredito/${id}`);
    return response.data;
  },

  create: async (data: CreateCartaoCreditoRequest) => {
    const response = await api.post<CartaoCredito>('/CartaoCredito', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCartaoCreditoRequest) => {
    await api.put(`/CartaoCredito/${id}`, data);
  },

  delete: async (id: number) => {
    await api.delete(`/CartaoCredito/${id}`);
  },
};
