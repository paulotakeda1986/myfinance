import api from "./api";

export interface Categoria {
  id: number;
  nome: string;
  tipo: string; // "Receita" or "Despesa" from backend
  fixo: boolean;
  valorFixo?: number;
}

export interface CreateCategoriaRequest {
  nome: string;
  fixo: boolean;
  valorFixo?: number;
}

export interface UpdateCategoriaRequest {
  nome: string;
  fixo: boolean;
  valorFixo?: number;
}

export const categoryService = {
  getReceitas: async () => {
    const response = await api.get<Categoria[]>("/categoria/receita");
    return response.data;
  },
  getDespesas: async () => {
    const response = await api.get<Categoria[]>("/categoria/despesa");
    return response.data;
  },
  create: async (type: "Receita" | "Despesa", data: CreateCategoriaRequest) => {
    const endpoint = type === "Receita" ? "/categoria/receita" : "/categoria/despesa";
    const response = await api.post<Categoria>(endpoint, data);
    return response.data;
  },
  update: async (id: number, type: "Receita" | "Despesa", data: UpdateCategoriaRequest) => {
    const endpoint = type === "Receita" ? `/categoria/receita/${id}` : `/categoria/despesa/${id}`;
    await api.put(endpoint, data);
  },
  delete: async (id: number, type: "Receita" | "Despesa") => {
    const endpoint = type === "Receita" ? `/categoria/receita/${id}` : `/categoria/despesa/${id}`;
    await api.delete(endpoint);
  },
};
