import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Banco } from "../../services/domainService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const creditCardSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  limiteTotal: z.coerce.number().min(0, "Limite deve ser maior ou igual a zero"),
  bancoId: z.coerce.number().nullable().optional(),
  carteiraId: z.coerce.number().nullable().optional(),
  ativo: z.boolean(),
  diaFechamentoFatura: z.coerce.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31"),
  diaVencimentoFatura: z.coerce.number().min(1, "Dia deve ser entre 1 e 31").max(31, "Dia deve ser entre 1 e 31"),
});

type CreditCardSchema = z.infer<typeof creditCardSchema>;

interface CreditCardFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  bancos: Banco[];
  carteiras: any[];
  loading?: boolean;
  isEditing?: boolean;
}

export function CreditCardForm({
  onSubmit,
  initialData,
  bancos,
  carteiras,
  loading,
  isEditing,
}: CreditCardFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreditCardSchema>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: initialData || {
      nome: "",
      limiteTotal: 0,
      ativo: true,
      carteiraId: initialData?.carteiraId || null,
      diaFechamentoFatura: 1,
      diaVencimentoFatura: 1,
    },
  });

  const bancoId = watch("bancoId");
  const carteiraId = watch("carteiraId");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome do Cartão (ex: Nubank Gold)</Label>
        <Input
          id="nome"
          placeholder="Digite o nome do cartão"
          {...register("nome")}
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bancoId">Banco (Opcional)</Label>
        <Select
          value={bancoId?.toString()}
          onValueChange={(val) => setValue("bancoId", Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um banco" />
          </SelectTrigger>
          <SelectContent>
            {bancos.map((banco) => (
              <SelectItem key={banco.id} value={banco.id.toString()}>
                {banco.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="carteiraId">Carteira para Pagamento (Opcional)</Label>
        <Select
          value={carteiraId?.toString()}
          onValueChange={(val) => setValue("carteiraId", Number(val))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma carteira" />
          </SelectTrigger>
          <SelectContent>
            {carteiras.map((wallet) => (
              <SelectItem key={wallet.id} value={wallet.id.toString()}>
                {wallet.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="limiteTotal">Limite Total</Label>
        <Input
          id="limiteTotal"
          type="number"
          step="0.01"
          placeholder="0,00"
          {...register("limiteTotal")}
        />
        {errors.limiteTotal && (
          <p className="text-sm text-red-500">{errors.limiteTotal.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diaFechamentoFatura">Dia Fechamento</Label>
          <Input
            id="diaFechamentoFatura"
            type="number"
            min="1"
            max="31"
            placeholder="1"
            {...register("diaFechamentoFatura")}
          />
          {errors.diaFechamentoFatura && (
            <p className="text-sm text-red-500">{errors.diaFechamentoFatura.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="diaVencimentoFatura">Dia Vencimento</Label>
          <Input
            id="diaVencimentoFatura"
            type="number"
            min="1"
            max="31"
            placeholder="1"
            {...register("diaVencimentoFatura")}
          />
          {errors.diaVencimentoFatura && (
            <p className="text-sm text-red-500">{errors.diaVencimentoFatura.message}</p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex items-center space-x-2">
           <input
            type="checkbox"
            id="ativo"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register("ativo")}
          />
          <Label htmlFor="ativo">Cartão Ativo</Label>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : isEditing ? "Atualizar Cartão" : "Criar Cartão"}
      </Button>
    </form>
  );
}
