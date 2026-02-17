import api from './api';

export interface Fatura {
  id: number;
  cartaoCreditoId: number;
  cartaoNome: string;
  competenciaId: number;
  competenciaFormatada: string;
  valorTotal: number;
  fechada: boolean;
  dataFechamento?: string;
}

export const invoiceService = {
  getAll: async () => {
    const response = await api.get<Fatura[]>('/Fatura');
    return response.data;
  },

  pagar: async (id: number) => {
    await api.post(`/Fatura/${id}/pagar`);
  },
};
