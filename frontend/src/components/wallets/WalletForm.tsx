import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CurrencyInput } from "../ui/CurrencyInput";
import { Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Banco, TipoCarteira } from "../../services/domainService";
import { CreateCarteiraRequest, UpdateCarteiraRequest } from "../../services/walletService";

const walletSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  bancoId: z.string().optional(), // Select returns string, need to parse
  tipoCarteiraId: z.string().min(1, "Tipo é obrigatório"),
  saldoInicial: z.coerce.number().optional().default(0),
});

type WalletSchema = z.infer<typeof walletSchema>;

interface WalletFormProps {
  onSubmit: (data: CreateCarteiraRequest | UpdateCarteiraRequest) => void;
  initialData?: any; // Wallet object
  bancos: Banco[];
  tiposCarteira: TipoCarteira[];
  loading?: boolean;
  isEditing?: boolean;
}

export function WalletForm({
  onSubmit,
  initialData,
  bancos,
  tiposCarteira,
  loading,
  isEditing,
}: WalletFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<WalletSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(walletSchema) as any,
    defaultValues: {
      nome: initialData?.nome || "",
      bancoId: initialData?.bancoId?.toString() || "",
      tipoCarteiraId: initialData?.tipoCarteiraId?.toString() || "",
      saldoInicial: initialData?.saldoInicial || 0,
    },
  });
  
  // Watch used to conditionally render fields if needed, e.g. only show Banco if Type is 'Conta Corrente'
  // But for now, we just show all.

  useEffect(() => {
    if (initialData) {
      setValue("nome", initialData.nome);
      setValue("bancoId", initialData.bancoId?.toString() || "");
      setValue("tipoCarteiraId", initialData.tipoCarteiraId?.toString() || "");
      if (!isEditing) {
          setValue("saldoInicial", initialData.saldoInicial);
      }
    }
  }, [initialData, setValue, isEditing]);

  const onFormSubmit = (data: any) => {
    const payload: any = {
      nome: data.nome,
      tipoCarteiraId: Number(data.tipoCarteiraId),
      bancoId: data.bancoId ? Number(data.bancoId) : null,
    };
    
    if (!isEditing) {
        payload.saldoInicial = Number(data.saldoInicial);
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Carteira</Label>
        <Input id="nome" {...register("nome")} placeholder="Ex: Conta Principal" />
        {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="tipoCarteira">Tipo</Label>
            <Select 
                onValueChange={(val) => setValue("tipoCarteiraId", val)} 
                defaultValue={initialData?.tipoCarteiraId?.toString() || ""}
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                {tiposCarteira.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                        {tipo.nome}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>
            {errors.tipoCarteiraId && <p className="text-xs text-red-500">{errors.tipoCarteiraId.message}</p>}
        </div>

        <div className="space-y-2">
            <Label htmlFor="banco">Banco (Opcional)</Label>
            <Select 
                onValueChange={(val) => setValue("bancoId", val === "null" ? "" : val)} 
                defaultValue={initialData?.bancoId?.toString() || ""}
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="null">Nenhum</SelectItem>
                {bancos.map((banco) => (
                    <SelectItem key={banco.id} value={banco.id.toString()}>
                        {banco.nome}
                    </SelectItem>
                ))}
            </SelectContent>
            </Select>
             {errors.bancoId && <p className="text-xs text-red-500">{errors.bancoId.message}</p>}
        </div>
      </div>

      {!isEditing && (
        <div className="space-y-2">
            <Label htmlFor="saldoInicial">Saldo Inicial</Label>
            <Controller
              name="saldoInicial"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="saldoInicial"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.saldoInicial && <p className="text-xs text-red-500">{errors.saldoInicial.message}</p>}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Salvar Alterações" : "Criar Carteira"}
      </Button>
    </form>
  );
}
