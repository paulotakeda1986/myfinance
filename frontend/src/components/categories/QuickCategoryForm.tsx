import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { categoryService, Categoria } from "../../services/categoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const categorySchema = z.object({
  nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
});

type CategorySchema = z.infer<typeof categorySchema>;

interface QuickCategoryFormProps {
  tipo: number; // 1=Receita, 2=Despesa
  onSuccess: (id: number, name: string) => void;
  onCancel: () => void;
}

export function QuickCategoryForm({ tipo, onSuccess, onCancel }: QuickCategoryFormProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
  });

  const mutation = useMutation({
    mutationFn: (data: CategorySchema) => {
      const typeStr = tipo === 1 ? "Receita" : "Despesa";
      return categoryService.create(typeStr, { ...data, fixo: false });
    },
    onSuccess: (data: Categoria) => {
      queryClient.invalidateQueries({ queryKey: tipo === 1 ? ["categories_receitas"] : ["categories_despesas"] });
      onSuccess(data.id, data.nome);
    },
    onError: (err: any) => {
      console.error(err);
      setError("Erro ao criar categoria. Verifique se o nome já existe.");
    },
  });

  const onSubmit = (data: CategorySchema) => {
    mutation.mutate(data);
  };

  return (
    <div className="bg-muted/50 p-4 rounded-lg border border-border mt-2 space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-primary">Nova Categoria de {tipo === 1 ? "Receita" : "Despesa"}</h4>
        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {error && (
          <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{error}</p>
        )}
        <div className="space-y-1">
          <Label htmlFor="quick-cat-name" className="text-xs">Nome da Categoria</Label>
          <div className="flex gap-2">
            <Input
              id="quick-cat-name"
              placeholder="Ex: Alimentação"
              className="h-9 text-sm"
              {...register("nome")}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(onSubmit)();
                }
              }}
            />
            <Button 
              type="button" 
              size="sm" 
              disabled={mutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          {errors.nome && (
            <p className="text-xs text-red-500">{errors.nome.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
