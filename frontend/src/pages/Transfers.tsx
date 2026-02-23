import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import axios from "axios";
import { Button } from "../components/ui/button";
import { transactionService, CreateLancamentoRequest } from "../services/transactionService";
import { walletService } from "../services/walletService";
import { ArrowLeftRight, CheckCircle2, AlertCircle } from "lucide-react";
import { domainService } from "../services/domainService";

export default function Transfers() {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [origemId, setOrigemId] = useState<string>("");
  const [destinoId, setDestinoId] = useState<string>("");
  const [valor, setValor] = useState<string>("");
  const [dataLocal, setDataLocal] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [descricao, setDescricao] = useState<string>("Transferência");
  const [tipoTransferenciaId, setTipoTransferenciaId] = useState<string>("");

  // Queries
  const { data: wallets, isLoading: isLoadingWallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getAll,
  });

  const { data: tiposTransferencia, isLoading: isLoadingTipos } = useQuery({
    queryKey: ["tipos_transferencia"],
    queryFn: domainService.getTiposTransferencia,
  });

  const createMutation = useMutation({
    mutationFn: transactionService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    }
  });

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!origemId && !destinoId) {
      setErrorMsg("Selecione pelo menos uma conta de origem ou destino.");
      return;
    }

    if (origemId === destinoId) {
      setErrorMsg("A conta de origem e destino não podem ser a mesma.");
      return;
    }

    const val = parseFloat(valor.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Informe um valor válido maior que zero.");
      return;
    }

    if (!dataLocal) {
      setErrorMsg("Informe uma data válida.");
      return;
    }

    if (!tipoTransferenciaId) {
      setErrorMsg("Selecione o tipo de transferência.");
      return;
    }

    try {
      const promises = [];
      const tipoTransfId = parseInt(tipoTransferenciaId);

      // 1. Origem is selected -> Create an Expense
      if (origemId) {
        const despesaReq: CreateLancamentoRequest = {
          descricao: descricao || "Transferência de saída",
          valor: val,
          dataLancamento: dataLocal,
          tipoLancamentoId: 2, // Despesa
          tipoTransferenciaId: tipoTransfId,
          carteiraId: parseInt(origemId),
          parcelado: false,
          fixo: false,
          efetivada: true, // Assume it's realized
        };
        promises.push(createMutation.mutateAsync(despesaReq));
      }

      // 2. Destino is selected -> Create a Revenue
      if (destinoId) {
        const receitaReq: CreateLancamentoRequest = {
          descricao: descricao || "Transferência de entrada",
          valor: val,
          dataLancamento: dataLocal,
          tipoLancamentoId: 1, // Receita
          tipoTransferenciaId: tipoTransfId,
          carteiraId: parseInt(destinoId),
          parcelado: false,
          fixo: false,
          efetivada: true, // Assume it's realized
        };
        promises.push(createMutation.mutateAsync(receitaReq));
      }

      await Promise.all(promises);

      setSuccessMsg("Transferência realizada com sucesso!");
      
      // Clear form
      setOrigemId("");
      setDestinoId("");
      setValor("");
      setDescricao("Transferência");
      
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err) && err.response?.data) {
        setErrorMsg(typeof err.response.data === 'string' ? err.response.data : "Erro ao realizar transferência.");
      } else {
        setErrorMsg("Ocorreu um erro ao realizar a transferência.");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nova Transferência</h2>
          <p className="text-muted-foreground mt-1">Transfira saldo entre suas contas ou registre entradas/saídas como transferência.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="bg-card rounded-lg border shadow-sm">
        <form onSubmit={handleTransfer} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Tipo Transferência Full Width on Top */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Tipo de Transferência <span className="text-red-500">*</span>
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={tipoTransferenciaId}
                onChange={(e) => setTipoTransferenciaId(e.target.value)}
                disabled={isLoadingTipos}
                required
              >
                <option value="">Selecione o tipo</option>
                {tiposTransferencia?.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
            {/* Conta Origem */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conta de Origem (Saída)
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={origemId}
                onChange={(e) => setOrigemId(e.target.value)}
                disabled={isLoadingWallets}
              >
                <option value="">Selecione uma conta (Opcional)</option>
                {wallets?.map(w => (
                  <option key={w.id} value={w.id}>{w.bancoNome ? w.bancoNome + " - " : ""}{w.nome} (Saldo: R$ {w.saldoAtual.toFixed(2)})</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Selecione para gerar um lançamento de Despesa.</p>
            </div>

            {/* Icon between */}
            <div className="hidden md:flex absolute left-1/2 top-8 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full border shadow-sm">
              <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Conta Destino */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Conta de Destino (Entrada)
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
                disabled={isLoadingWallets}
              >
                <option value="">Selecione uma conta (Opcional)</option>
                {wallets?.map(w => (
                   <option key={w.id} value={w.id}>{w.bancoNome ? w.bancoNome + " - " : ""}{w.nome} (Saldo: R$ {w.saldoAtual.toFixed(2)})</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Selecione para gerar um lançamento de Receita.</p>
            </div>
          </div>

          <hr className="border-border" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Valor (R$) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Data da Transferência <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={dataLocal}
                onChange={(e) => setDataLocal(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Descrição
              </label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Transferência para poupança"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button 
                type="submit" 
                disabled={createMutation.isPending || isLoadingWallets}
                className="w-full md:w-auto"
            >
              {createMutation.isPending ? "Processando..." : "Realizar Transferência"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
