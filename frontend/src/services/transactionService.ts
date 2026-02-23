import api from "./api";

export interface Lancamento {
  id: number;
  data: string; // Matches LancamentoResponse.Data (mapped by DateOnly)
  descricao: string;
  valor: number;
  tipoLancamentoId: number; 
  categoriaId?: number;
  categoriaNome?: string;
  carteiraId?: number;
  carteiraNome?: string;
  cartaoCreditoId?: number;
  cartaoNome?: string;
  parcelado: boolean;
  numeroParcela?: number;
  totalParcelas?: number;
  efetivada: boolean;
  fixo: boolean;
  status: string;
  isParcela?: boolean;
  lancamentoId?: number;
}

export interface CreateLancamentoRequest {
  descricao: string;
  valor: number;
  dataLancamento: string;
  tipoLancamentoId: number;
  categoriaId?: number;
  carteiraId?: number;
  cartaoCreditoId?: number;
  tipoTransferenciaId?: number;
  parcelado: boolean;
  totalParcelas?: number;
  modoParcelamento?: number; // 1: Dividir, 2: Repetir
  fixo: boolean;
  efetivada: boolean;
  observacao?: string;
  faturaId?: number;
}

export interface UpdateLancamentoRequest {
  descricao: string;
  valor: number;
  dataLancamento: string;
  categoriaId?: number;
  carteiraId?: number;
  cartaoCreditoId?: number;
  fixo: boolean;
  efetivada: boolean;
  scope?: number; // 1: Only, 2: Future, 3: All
}

export const transactionService = {
  getAll: async (mes: number, ano: number) => {
    const response = await api.get<Lancamento[]>(`/Lancamento?mes=${mes}&ano=${ano}`);
    return response.data;
  },
  create: async (data: CreateLancamentoRequest) => {
    const response = await api.post<Lancamento>("/Lancamento", data);
    return response.data;
  },
  update: async (id: number, data: UpdateLancamentoRequest) => {
    await api.put(`/Lancamento/${id}`, data);
  },
  delete: async (id: number, scope: number = 1) => {
    await api.delete(`/Lancamento/${id}?scope=${scope}`);
  },
};
