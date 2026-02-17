import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Carteira } from "../../services/walletService";
import { CartaoCredito } from "../../services/creditCardService";

export interface TransactionFilters {
  tipoLancamento?: "1" | "2"; // 1: Receita, 2: Despesa
  origemPagamento?: "wallet" | "card"; // Carteira ou Cartão
  carteiraId?: number;
  cartaoCreditoId?: number;
  dataInicio?: Date;
  dataFim?: Date;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  wallets: Carteira[];
  cards: CartaoCredito[];
  onClose: () => void;
}

export function TransactionFiltersPanel({
  filters,
  onFiltersChange,
  wallets,
  cards,
  onClose,
}: TransactionFiltersProps) {
  const [localFilters, setLocalFilters] = useState<TransactionFilters>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onFiltersChange({});
    onClose();
  };

  const updateFilter = (key: keyof TransactionFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros Avançados</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tipo de Lançamento */}
        <div className="space-y-2">
          <Label>Tipo de Lançamento</Label>
          <Select
            value={localFilters.tipoLancamento}
            onValueChange={(val) => updateFilter("tipoLancamento", val as "1" | "2" | undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todos</SelectItem>
              <SelectItem value="1">Receita</SelectItem>
              <SelectItem value="2">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Origem de Pagamento */}
        <div className="space-y-2">
          <Label>Origem de Pagamento</Label>
          <Select
            value={localFilters.origemPagamento}
            onValueChange={(val) => {
              updateFilter("origemPagamento", val === "none" ? undefined : val);
              // Clear specific wallet/card when changing type
              if (val !== localFilters.origemPagamento) {
                updateFilter("carteiraId", undefined);
                updateFilter("cartaoCreditoId", undefined);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Todos</SelectItem>
              <SelectItem value="wallet">Carteira</SelectItem>
              <SelectItem value="card">Cartão de Crédito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Carteira Específica */}
        {localFilters.origemPagamento === "wallet" && (
          <div className="space-y-2">
            <Label>Carteira</Label>
            <Select
              value={localFilters.carteiraId?.toString()}
              onValueChange={(val) => updateFilter("carteiraId", val === "none" ? undefined : Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Todas</SelectItem>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id.toString()}>
                    {wallet.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Cartão Específico */}
        {localFilters.origemPagamento === "card" && (
          <div className="space-y-2">
            <Label>Cartão de Crédito</Label>
            <Select
              value={localFilters.cartaoCreditoId?.toString()}
              onValueChange={(val) => updateFilter("cartaoCreditoId", val === "none" ? undefined : Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Todos</SelectItem>
                {cards.map((card) => (
                  <SelectItem key={card.id} value={card.id.toString()}>
                    {card.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Data Início */}
        <div className="space-y-2">
          <Label>Data Início</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !localFilters.dataInicio && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localFilters.dataInicio ? (
                  format(localFilters.dataInicio, "dd/MM/yyyy")
                ) : (
                  <span>Selecione</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={localFilters.dataInicio}
                onSelect={(date) => updateFilter("dataInicio", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Data Fim */}
        <div className="space-y-2">
          <Label>Data Fim</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !localFilters.dataFim && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {localFilters.dataFim ? (
                  format(localFilters.dataFim, "dd/MM/yyyy")
                ) : (
                  <span>Selecione</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={localFilters.dataFim}
                onSelect={(date) => updateFilter("dataFim", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={handleClear}>
          Limpar Filtros
        </Button>
        <Button onClick={handleApply}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
