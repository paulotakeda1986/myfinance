import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Lancamento } from "../../services/transactionService";
import { useCounterAnimation } from "../../hooks/useCounterAnimation";

interface TransactionSummaryCardProps {
  transactions: Lancamento[];
}

export function TransactionSummaryCard({ transactions }: TransactionSummaryCardProps) {
  // Calculate totals
  const totalReceitas = transactions
    .filter((t) => t.tipoLancamentoId === 1)
    .reduce((sum, t) => sum + t.valor, 0);

  const totalDespesas = transactions
    .filter((t) => t.tipoLancamentoId === 2)
    .reduce((sum, t) => sum + t.valor, 0);

  const saldo = totalReceitas - totalDespesas;

  // Animated values
  const animatedReceitas = useCounterAnimation(totalReceitas);
  const animatedDespesas = useCounterAnimation(totalDespesas);
  const animatedSaldo = useCounterAnimation(saldo);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Receitas */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receitas</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(animatedReceitas)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Despesas */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Despesas</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(animatedDespesas)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Saldo */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${
              saldo >= 0 
                ? "bg-blue-100 dark:bg-blue-900/20" 
                : "bg-orange-100 dark:bg-orange-900/20"
            }`}>
              <DollarSign className={`h-5 w-5 ${
                saldo >= 0 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-orange-600 dark:text-orange-400"
              }`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Saldo</p>
              <p className={`text-2xl font-bold ${
                saldo >= 0 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-orange-600 dark:text-orange-400"
              }`}>
                {formatCurrency(animatedSaldo)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
