import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Filter, FilterX } from "lucide-react";
import { format } from "date-fns";
import axios from "axios";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { transactionService, Lancamento, CreateLancamentoRequest, UpdateLancamentoRequest } from "../services/transactionService";
import { categoryService } from "../services/categoryService";
import { walletService } from "../services/walletService";
import { creditCardService } from "../services/creditCardService";
import { CreditCard as CreditCardIcon, Wallet as WalletIcon } from "lucide-react";
import { parseDateOnly } from "../lib/dateUtils";
import { TransactionFiltersPanel, TransactionFilters } from "../components/transactions/TransactionFiltersPanel";

export default function Transactions() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Lancamento | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState<{ type: 'edit' | 'delete', transaction: Lancamento } | null>(null);
  const [tempFormData, setTempFormData] = useState<CreateLancamentoRequest | null>(null);
  
  // Date State
  const currentDate = new Date();
  const [mes, setMes] = useState(currentDate.getMonth() + 1);
  const [ano, setAno] = useState(currentDate.getFullYear());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({});

  // Queries
  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", mes, ano],
    queryFn: () => transactionService.getAll(mes, ano),
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getAll,
  });

  const { data: cards } = useQuery({
    queryKey: ["credit_cards"],
    queryFn: creditCardService.getAll,
  });

  const { data: receitasCategories } = useQuery({
    queryKey: ["categories_receitas"],
    queryFn: categoryService.getReceitas,
  });

  const { data: despesasCategories } = useQuery({
    queryKey: ["categories_despesas"],
    queryFn: categoryService.getDespesas,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
      setIsDialogOpen(false);
      setError(null);
    },
    onError: (err: unknown) => {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : "Erro ao criar lançamento.");
      } else {
        setError("Ocorreu um erro ao criar lançamento.");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: UpdateLancamentoRequest }) =>
      transactionService.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsDialogOpen(false);
      setSelectedTransaction(null);
      setError(null);
    },
    onError: (err: unknown) => {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : "Erro ao atualizar lançamento.");
      } else {
        setError("Ocorreu um erro ao atualizar lançamento.");
      }
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (data: { id: number; scope: number }) =>
      transactionService.delete(data.id, data.scope),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setIsBulkDialogOpen(false);
      setBulkAction(null);
      setError(null); 
    },
    onError: (err: unknown) => {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data) {
          setError(typeof err.response.data === 'string' ? err.response.data : "Erro ao excluir. Tente novamente.");
      } else {
        setError("Ocorreu um erro ao excluir. Tente novamente.");
      }
    },
  });

  // Handlers
  const handleSubmit = (data: CreateLancamentoRequest) => {
    setError(null);
    if (selectedTransaction) {
      if (selectedTransaction.parcelado || selectedTransaction.isParcela) {
          setTempFormData(data);
          setBulkAction({ type: 'edit', transaction: selectedTransaction });
          setIsBulkDialogOpen(true);
          return;
      }
      
      const payload: UpdateLancamentoRequest = {
        descricao: data.descricao,
        valor: data.valor,
        dataLancamento: data.dataLancamento,
        categoriaId: data.categoriaId,
        carteiraId: data.carteiraId,
        cartaoCreditoId: data.cartaoCreditoId,
        fixo: data.fixo,
        efetivada: data.efetivada,
        scope: 1
      };
      updateMutation.mutate({ id: selectedTransaction.id, payload });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleBulkScopeSelected = (scope: number) => {
      if (!bulkAction) return;
      
      if (bulkAction.type === 'delete') {
          deleteMutation.mutate({ id: bulkAction.transaction.id, scope });
      } else if (bulkAction.type === 'edit' && tempFormData) {
          const payload: UpdateLancamentoRequest = {
            descricao: tempFormData.descricao,
            valor: tempFormData.valor,
            dataLancamento: tempFormData.dataLancamento,
            categoriaId: tempFormData.categoriaId,
            carteiraId: tempFormData.carteiraId,
            cartaoCreditoId: tempFormData.cartaoCreditoId,
            fixo: tempFormData.fixo,
            efetivada: tempFormData.efetivada,
            scope: scope
          };
          updateMutation.mutate({ id: bulkAction.transaction.id, payload });
          setIsBulkDialogOpen(false);
          setBulkAction(null);
          setTempFormData(null);
          setIsDialogOpen(false);
      }
  };

  const handleEdit = (transaction: Lancamento) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
    setError(null); 
  };

  const handleCreate = () => {
    setSelectedTransaction(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (transaction: Lancamento) => {
      if (transaction.parcelado || transaction.isParcela) {
          setBulkAction({ type: 'delete', transaction });
          setIsBulkDialogOpen(true);
      } else if (confirm("Tem certeza que deseja excluir este lançamento?")) {
          deleteMutation.mutate({ id: transaction.id, scope: 1 });
      }
  }

  // Apply filters to transactions
  const filteredTransactions = transactions?.filter((transaction) => {
    // Filter by tipo
    if (filters.tipoLancamento && transaction.tipoLancamentoId.toString() !== filters.tipoLancamento) {
      return false;
    }
    
    // Filter by origem (wallet or card)
    if (filters.origemPagamento === "wallet" && !transaction.carteiraId) {
      return false;
    }
    if (filters.origemPagamento === "card" && !transaction.cartaoCreditoId) {
      return false;
    }
    
    // Filter by specific wallet
    if (filters.carteiraId && transaction.carteiraId !== filters.carteiraId) {
      return false;
    }
    
    // Filter by specific card
    if (filters.cartaoCreditoId && transaction.cartaoCreditoId !== filters.cartaoCreditoId) {
      return false;
    }
    
    // Filter by date range
    if (filters.dataInicio || filters.dataFim) {
      const transactionDate = parseDateOnly(transaction.data);
      if (filters.dataInicio && transactionDate < filters.dataInicio) {
        return false;
      }
      if (filters.dataFim && transactionDate > filters.dataFim) {
        return false;
      }
    }
    
    return true;
  }) || [];

  // Check if any filters are active
  const hasActiveFilters = Object.keys(filters).length > 0 && Object.values(filters).some(v => v !== undefined && v !== "");

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <span className="sr-only">Fechar</span>
            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
          </button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Lançamentos</h2>
        <div className="flex items-center gap-2">
             <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
                value={mes}
                onChange={(e) => setMes(Number(e.target.value))}
            >
                {[
                     { value: 1, label: "Janeiro" },
                     { value: 2, label: "Fevereiro" },
                     { value: 3, label: "Março" },
                     { value: 4, label: "Abril" },
                     { value: 5, label: "Maio" },
                     { value: 6, label: "Junho" },
                     { value: 7, label: "Julho" },
                     { value: 8, label: "Agosto" },
                     { value: 9, label: "Setembro" },
                     { value: 10, label: "Outubro" },
                     { value: 11, label: "Novembro" },
                     { value: 12, label: "Dezembro" },
                ].map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>
            <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
            >
                {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              {hasActiveFilters ? (
                <FilterX className="mr-2 h-4 w-4" />
              ) : (
                <Filter className="mr-2 h-4 w-4" />
              )}
              Filtros
            </Button>
            <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" /> Novo
            </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <TransactionFiltersPanel
          filters={filters}
          onFiltersChange={setFilters}
          wallets={wallets || []}
          cards={cards || []}
          onClose={() => setShowFilters(false)}
        />
      )}

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Data</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Descrição</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Categoria</th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Carteira/Cartão</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Valor</th>
                        <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Pago</th>
                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Ações</th>
                    </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                    {isLoadingTransactions ? (
                        <tr>
                            <td colSpan={7} className="p-4 text-center">Carregando...</td>
                        </tr>
                    ) : filteredTransactions.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-muted-foreground">Nenhum lançamento encontrado.</td>
                        </tr>
                    ) : (
                        filteredTransactions.map((t) => (
                            <tr key={t.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <td className="p-4 align-middle whitespace-nowrap">{format(parseDateOnly(t.data), "dd/MM/yyyy")}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2 font-medium">
                                        {t.descricao}
                                        {t.fixo && <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full">FIXA</span>}
                                    </div>
                                    {t.status === "Pendente" && !t.efetivada && <div className="text-[10px] text-yellow-600 font-semibold uppercase">Pendente</div>}
                                </td>
                                <td className="p-4 align-middle">{t.categoriaNome || "N/A"}</td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2">
                                        {t.cartaoNome ? (
                                            <>
                                                <CreditCardIcon className="h-3 w-3 text-muted-foreground" />
                                                <span>{t.cartaoNome}</span>
                                            </>
                                        ) : (
                                            <>
                                                <WalletIcon className="h-3 w-3 text-muted-foreground" />
                                                <span>{t.carteiraNome || "N/A"}</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className={`p-4 align-middle text-right font-bold whitespace-nowrap ${t.tipoLancamentoId === 1 ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.tipoLancamentoId === 1 ? '+' : '-'}{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                                </td>
                                <td className="p-4 align-middle text-center">
                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${t.efetivada ? 'border-transparent bg-green-100 text-green-800' : 'border-transparent bg-yellow-100 text-yellow-800'}`}>
                                        {t.efetivada ? "Sim" : "Não"}
                                    </div>
                                </td>
                                <td className="p-4 align-middle text-right whitespace-nowrap">
                                     <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                                         <Pencil className="h-4 w-4" />
                                     </Button>
                                     <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(t)}>
                                         <Trash2 className="h-4 w-4" />
                                     </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedTransaction ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
            <DialogDescription>
              {selectedTransaction ? "Edite os detalhes do lançamento." : "Preencha os dados para criar um novo lançamento."}
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleSubmit}
            initialData={selectedTransaction}
            walletList={wallets || []}
            cartaoList={cards || []}
            categoryListReceitas={receitasCategories || []}
            categoryListDespesas={despesasCategories || []}
            loading={createMutation.isPending || updateMutation.isPending}
            isEditing={!!selectedTransaction}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{bulkAction?.type === 'delete' ? "Excluir Lançamento" : "Alterar Lançamento"}</DialogTitle>
            <DialogDescription>
              Este lançamento faz parte de um parcelamento. O que deseja fazer?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
              <Button onClick={() => handleBulkScopeSelected(1)} variant="outline" className="justify-start">
                  Somente este lançamento
              </Button>
              <Button onClick={() => handleBulkScopeSelected(2)} variant="outline" className="justify-start">
                  Lançamentos futuros
              </Button>
              <Button onClick={() => handleBulkScopeSelected(3)} variant="outline" className="justify-start">
                  Todos os Lançamentos
              </Button>
              <Button onClick={() => setIsBulkDialogOpen(false)} variant="ghost" className="mt-2">
                  Cancelar
              </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
