import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Plus, Wallet, CreditCard, FileText } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Categoria } from "../../services/categoryService";
import { Carteira } from "../../services/walletService";
import { CartaoCredito } from "../../services/creditCardService";
import { CreateLancamentoRequest } from "../../services/transactionService";
import { invoiceService, Fatura } from "../../services/invoiceService";
import { QuickCategoryForm } from "../categories/QuickCategoryForm";
import { parseDateOnly, formatDateOnly } from "../../lib/dateUtils";
import { CurrencyInput } from "../ui/CurrencyInput";
import { Controller } from "react-hook-form";

const transactionSchema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valor: z.coerce.number().min(0.01, "Valor deve ser maior que 0"),
  tipoLancamentoId: z.string(), // "1" or "2"
  categoriaId: z.string().min(1, "Categoria é obrigatória"),
  // unifiedSelection will be "wallet:ID" or "card:ID"
  unifiedSelection: z.string().min(1, "Selecione uma carteira ou cartão"),
  dataLancamento: z.date(),
  efetivada: z.boolean().default(false),
  fixo: z.boolean().default(false),
  observacao: z.string().optional(),
  parcelado: z.boolean().default(false),
  modoParcelamento: z.string().default("1"), // "1": Dividir, "2": Repetir
  totalParcelas: z.coerce.number().optional(),
  faturaId: z.string().optional(),
});

type TransactionSchema = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  onSubmit: (data: CreateLancamentoRequest) => void;
  initialData?: any;
  walletList: Carteira[];
  cartaoList: CartaoCredito[];
  categoryListReceitas: Categoria[];
  categoryListDespesas: Categoria[];
  loading?: boolean;
  isEditing?: boolean;
}

export function TransactionForm({
  onSubmit,
  initialData,
  walletList,
  cartaoList,
  categoryListReceitas,
  categoryListDespesas,
  loading,
  isEditing,
}: TransactionFormProps) {
  const [showQuickCategory, setShowQuickCategory] = useState(false);
  const [invoices, setInvoices] = useState<Fatura[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<TransactionSchema>({
    resolver: zodResolver(transactionSchema) as any,
    defaultValues: {
      descricao: initialData?.descricao || "",
      valor: initialData?.valor || 0,
      tipoLancamentoId: initialData?.tipoLancamentoId?.toString() || "2", 
      categoriaId: initialData?.categoriaId?.toString() || "",
      unifiedSelection: initialData?.cartaoCreditoId 
        ? `card:${initialData.cartaoCreditoId}` 
        : initialData?.carteiraId 
          ? `wallet:${initialData.carteiraId}` 
          : "",
      dataLancamento: initialData?.dataLancamento ? parseDateOnly(initialData.dataLancamento) : new Date(),
      efetivada: initialData?.efetivada || false,
      fixo: initialData?.fixo || false,
      observacao: initialData?.observacao || "",
      parcelado: initialData?.parcelado || false,
      modoParcelamento: "1",
      totalParcelas: initialData?.totalParcelas || 2,
      faturaId: initialData?.faturaId?.toString() || "",
    },
  });

  const tipoLancamentoId = watch("tipoLancamentoId");
  const parcelado = watch("parcelado");
  const unifiedSelection = watch("unifiedSelection");
  const isCreditCard = unifiedSelection?.startsWith("card:");

  useEffect(() => {
    if (isCreditCard) {
      setValue("efetivada", false);
    }
  }, [isCreditCard, setValue]);

  // Fetch invoices when a credit card is selected
  useEffect(() => {
    if (isCreditCard) {
      const cardId = unifiedSelection.split(":")[1];
      setLoadingInvoices(true);
      invoiceService.getAll()
        .then((allInvoices) => {
          const cardInvoices = allInvoices.filter(f => f.cartaoCreditoId === Number(cardId));
          setInvoices(cardInvoices);
        })
        .catch((err) => {
          console.error("Error fetching invoices:", err);
          setInvoices([]);
        })
        .finally(() => setLoadingInvoices(false));
    } else {
      setInvoices([]);
      setValue("faturaId", "");
    }
  }, [isCreditCard, unifiedSelection, setValue]);

  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    if (tipoLancamentoId === "1") {
      setCategories(categoryListReceitas);
      // If it's a receipt, it MUST be a wallet, so if card is selected, reset it
      const currentSelection = watch("unifiedSelection");
      if (currentSelection?.startsWith("card:")) {
        setValue("unifiedSelection", "");
      }
    } else {
      setCategories(categoryListDespesas);
    }
  }, [tipoLancamentoId, categoryListReceitas, categoryListDespesas]);

  const onFormSubmit = (data: TransactionSchema) => {
    const [type, id] = data.unifiedSelection.split(":");
    
    const payload: CreateLancamentoRequest = {
      descricao: data.descricao,
      valor: data.valor,
      tipoLancamentoId: Number(data.tipoLancamentoId),
      categoriaId: Number(data.categoriaId),
      carteiraId: type === "wallet" ? Number(id) : undefined,
      cartaoCreditoId: type === "card" ? Number(id) : undefined,
      dataLancamento: formatDateOnly(data.dataLancamento),
      efetivada: data.efetivada,
      fixo: data.fixo,
      observacao: data.observacao,
      parcelado: !!data.parcelado,
      modoParcelamento: data.parcelado ? Number(data.modoParcelamento) : undefined,
      totalParcelas: data.parcelado ? Number(data.totalParcelas) : undefined,
      faturaId: data.faturaId ? Number(data.faturaId) : undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="tipoLancamento">Tipo</Label>
            <Select 
                onValueChange={(val) => setValue("tipoLancamentoId", val)} 
                defaultValue={watch("tipoLancamentoId")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">Receita</SelectItem>
                <SelectItem value="2">Despesa</SelectItem>
            </SelectContent>
            </Select>
        </div>
         <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !watch("dataLancamento") && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {watch("dataLancamento") ? (
                    format(watch("dataLancamento"), "dd/MM/yyyy")
                    ) : (
                    <span>Selecione uma data</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={watch("dataLancamento")}
                    onSelect={(date) => date && setValue("dataLancamento", date)}
                    initialFocus
                />
                </PopoverContent>
            </Popover>
            {errors.dataLancamento && <p className="text-xs text-red-500">{errors.dataLancamento.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição</Label>
        <Input id="descricao" {...register("descricao")} placeholder="Ex: Supermercado" />
        {errors.descricao && <p className="text-xs text-red-500">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Controller
              name="valor"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="valor"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.valor && <p className="text-xs text-red-500">{errors.valor.message}</p>}
          </div>
           <div className="space-y-2">
            <Label htmlFor="carteira">{tipoLancamentoId === "2" ? "Carteira/Cartão" : "Carteira"}</Label>
            <Select 
                onValueChange={(val) => setValue("unifiedSelection", val)} 
                defaultValue={watch("unifiedSelection")}
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Carteiras</div>
                {walletList.map((wallet) => (
                    <SelectItem key={`wallet-${wallet.id}`} value={`wallet:${wallet.id}`}>
                        <div className="flex items-center gap-2">
                            <Wallet className="h-3 w-3" />
                            {wallet.nome}
                        </div>
                    </SelectItem>
                ))}
                {tipoLancamentoId === "2" && cartaoList.length > 0 && (
                    <>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-1">Cartões de Crédito</div>
                        {cartaoList.map((cartao) => (
                            <SelectItem key={`card-${cartao.id}`} value={`card:${cartao.id}`}>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-3 w-3" />
                                    {cartao.nome}
                                </div>
                            </SelectItem>
                        ))}
                    </>
                )}
            </SelectContent>
            </Select>
            {errors.unifiedSelection && <p className="text-xs text-red-500">{errors.unifiedSelection.message}</p>}
        </div>
      </div>

      {/* Invoice Selector - appears when credit card is selected */}
      {isCreditCard && (
        <div className="space-y-2">
          <Label htmlFor="faturaId">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Fatura do Cartão
            </div>
          </Label>
          {loadingInvoices ? (
            <div className="flex items-center justify-center p-4 border rounded-md">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Carregando faturas...
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-4 border rounded-md text-sm text-muted-foreground text-center">
              Nenhuma fatura disponível para este cartão
            </div>
          ) : (
            <Select 
              onValueChange={(val) => setValue("faturaId", val)} 
              value={watch("faturaId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a fatura" />
              </SelectTrigger>
              <SelectContent>
                {invoices.map((fatura) => (
                  <SelectItem key={fatura.id} value={fatura.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{fatura.competenciaFormatada}</span>
                      <span className="text-xs text-muted-foreground ml-4">
                        {fatura.fechada ? "(Fechada)" : "(Aberta)"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="categoria">Categoria</Label>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs gap-1"
            onClick={() => setShowQuickCategory(!showQuickCategory)}
          >
            <Plus className="h-3 w-3" />
            Nova
          </Button>
        </div>
        
        {showQuickCategory ? (
          <QuickCategoryForm 
            tipo={Number(tipoLancamentoId)} 
            onCancel={() => setShowQuickCategory(false)}
            onSuccess={(id) => {
              setValue("categoriaId", id.toString());
              setShowQuickCategory(false);
            }}
          />
        ) : (
          <Select 
            onValueChange={(val) => setValue("categoriaId", val)} 
            value={watch("categoriaId")}
          >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.nome}
                    </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
        {errors.categoriaId && <p className="text-xs text-red-500">{errors.categoriaId.message}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacao">Observação (Opcional)</Label>
        <Input id="observacao" {...register("observacao")} />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="flex items-center space-x-2">
          <input 
              type="checkbox" 
              id="efetivada" 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
              {...register("efetivada")}
              disabled={isCreditCard}
          />
          <Label 
            htmlFor="efetivada" 
            className={cn("text-sm font-normal cursor-pointer", isCreditCard && "text-muted-foreground cursor-not-allowed")}
          >
            Consolidado (Pago/Recebido)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <input 
              type="checkbox" 
              id="fixo" 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("fixo")}
          />
          <Label htmlFor="fixo" className="text-sm font-normal cursor-pointer">Lançamento Fixo</Label>
        </div>
      </div>

      {!isEditing && (
         <div className="flex items-center space-x-2">
             <input 
                type="checkbox" 
                id="parcelado" 
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...register("parcelado")}
            />
            <Label htmlFor="parcelado" className="text-sm font-normal cursor-pointer">Parcelado?</Label>
         </div>
      )}

      {parcelado && !isEditing && (
          <div className="space-y-3 animate-in slide-in-from-top-1 duration-200 bg-muted/30 p-3 rounded-md border border-border">
            <div className="space-y-2">
              <Label htmlFor="totalParcelas">Quantidade de Parcelas</Label>
              <Input id="totalParcelas" type="number" min="2" {...register("totalParcelas")} />
            </div>
            
            <div className="space-y-2">
              <Label>Estratégia de Parcelamento</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="modo-dividir" 
                    value="1" 
                    {...register("modoParcelamento")} 
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="modo-dividir" className="text-sm font-normal cursor-pointer">Dividir valor informado (ex: 300 em 3x = 100/mês)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="modo-repetir" 
                    value="2" 
                    {...register("modoParcelamento")} 
                    className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="modo-repetir" className="text-sm font-normal cursor-pointer">Repetir valor informado (ex: 300 em 3x = 300/mês)</Label>
                </div>
              </div>
            </div>
          </div>
      )}

      <Button type="submit" className="w-full mt-4" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Salvar Alterações" : "Adicionar Lançamento"}
      </Button>
    </form>
  );
}

