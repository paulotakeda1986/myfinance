import api from "./api";

export interface Banco {
  id: number;
  nome: string;
  codigo: string;
}

export interface TipoCarteira {
  id: number;
  nome: string;
}

export interface TipoTransferencia {
  id: number;
  nome: string;
}

export const domainService = {
  getBancos: async () => {
    const response = await api.get<Banco[]>("/dominio/bancos");
    return response.data;
  },
  getTiposCarteira: async () => {
    const response = await api.get<TipoCarteira[]>("/dominio/tipos-carteira");
    return response.data;
  },
  getTiposTransferencia: async () => {
    const response = await api.get<TipoTransferencia[]>("/dominio/tipos-transferencia");
    return response.data;
  },
};
