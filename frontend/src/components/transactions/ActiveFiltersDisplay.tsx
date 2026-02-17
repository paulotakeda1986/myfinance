import { X } from "lucide-react";
import { TransactionFilters } from "./TransactionFiltersPanel";
import { Carteira } from "../../services/walletService";
import { CartaoCredito } from "../../services/creditCardService";
import { format } from "date-fns";

interface ActiveFiltersDisplayProps {
  filters: TransactionFilters;
  onRemoveFilter: (filterKey: keyof TransactionFilters) => void;
  wallets: Carteira[];
  cards: CartaoCredito[];
}

export function ActiveFiltersDisplay({
  filters,
  onRemoveFilter,
  wallets,
  cards,
}: ActiveFiltersDisplayProps) {
  const hasFilters = Object.keys(filters).length > 0 && Object.values(filters).some(v => v !== undefined && v !== "");

  if (!hasFilters) return null;

  const getFilterLabel = (key: keyof TransactionFilters, value: any): string => {
    switch (key) {
      case "tipoLancamento":
        return value === "1" ? "Receitas" : "Despesas";
      case "efetivada":
        return value === true ? "Pagos" : "Pendentes";
      case "origemPagamento":
        return value === "wallet" ? "Carteira" : "Cartão";
      case "carteiraId":
        const wallet = wallets.find(w => w.id === value);
        return wallet ? `Carteira: ${wallet.nome}` : "Carteira";
      case "cartaoCreditoId":
        const card = cards.find(c => c.id === value);
        return card ? `Cartão: ${card.nome}` : "Cartão";
      case "dataInicio":
        return `De: ${format(value, "dd/MM/yyyy")}`;
      case "dataFim":
        return `Até: ${format(value, "dd/MM/yyyy")}`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground font-medium">Filtros ativos:</span>
      {Object.entries(filters).map(([key, value]) => {
        if (value === undefined || value === "") return null;
        
        const filterKey = key as keyof TransactionFilters;
        const label = getFilterLabel(filterKey, value);
        
        if (!label) return null;

        return (
          <div
            key={key}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
          >
            <span>{label}</span>
            <button
              onClick={() => onRemoveFilter(filterKey)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              aria-label={`Remover filtro ${label}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
