import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
// import { CreateCategoriaRequest, UpdateCategoriaRequest } from "../../services/categoryService";

const categorySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipo: z.enum(["Receita", "Despesa"]),
  fixo: z.boolean().default(false),
  valorFixo: z.coerce.number().optional().default(0),
});

type CategorySchema = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  loading?: boolean;
  isEditing?: boolean;
}

export function CategoryForm({
  onSubmit,
  initialData,
  loading,
  isEditing,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategorySchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      nome: initialData?.nome || "",
      tipo: initialData?.tipo || "Despesa",
      fixo: initialData?.fixo || false,
      valorFixo: initialData?.valorFixo || 0,
    },
  });

  const fixo = watch("fixo");
  // const tipo = watch("tipo");

  useEffect(() => {
     if (initialData) {
         setValue("nome", initialData.nome);
         setValue("tipo", initialData.tipo);
         setValue("fixo", initialData.fixo);
         setValue("valorFixo", initialData.valorFixo);
     }
  }, [initialData, setValue]);

  const onFormSubmit = (data: any) => {
      // Pass type separate from data payload if strictly following interface, 
      // but component usually passes everything up.
      // The parent component will extract type.
      onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Categoria</Label>
        <Input id="nome" {...register("nome")} placeholder="Ex: Alimentação" />
        {errors.nome && <p className="text-xs text-red-500">{errors.nome.message}</p>}
      </div>

      <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select 
                onValueChange={(val) => setValue("tipo", val as "Receita" | "Despesa")} 
                defaultValue={initialData?.tipo || "Despesa"}
                disabled={isEditing} // Often we don't allow changing type after creation
            >
            <SelectTrigger>
                <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Receita">Receita</SelectItem>
                <SelectItem value="Despesa">Despesa</SelectItem>
            </SelectContent>
            </Select>
             {errors.tipo && <p className="text-xs text-red-500">{errors.tipo.message}</p>}
        </div>

      <div className="flex items-center space-x-2">
         <input 
            type="checkbox" 
            id="fixo" 
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...register("fixo")}
        />
        <Label htmlFor="fixo">Recorrente/Fixo?</Label>
      </div>

      {fixo && (
           <div className="space-y-2">
            <Label htmlFor="valorFixo">Valor Fixo (Estimado)</Label>
            <Input id="valorFixo" type="number" step="0.01" {...register("valorFixo")} />
          </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? "Salvar Alterações" : "Criar Categoria"}
      </Button>
    </form>
  );
}
