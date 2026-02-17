import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { CategoryForm } from "../components/categories/CategoryForm";
import { categoryService, Categoria } from "../services/categoryService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Categories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Categoria | null>(null);
  const [activeTab, setActiveTab] = useState<"Receita" | "Despesa">("Despesa");

  // Fetch Data
  const { data: receitas, isLoading: isLoadingReceitas } = useQuery({
    queryKey: ["categorias_receitas"],
    queryFn: categoryService.getReceitas,
  });

  const { data: despesas, isLoading: isLoadingDespesas } = useQuery({
    queryKey: ["categorias_despesas"],
    queryFn: categoryService.getDespesas,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: { type: "Receita" | "Despesa", payload: any }) => 
        categoryService.create(data.type, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias_receitas"] });
      queryClient.invalidateQueries({ queryKey: ["categorias_despesas"] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; type: "Receita" | "Despesa"; payload: any }) =>
      categoryService.update(data.id, data.type, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias_receitas"] });
      queryClient.invalidateQueries({ queryKey: ["categorias_despesas"] });
      setIsDialogOpen(false);
      setSelectedCategory(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (data: { id: number; type: "Receita" | "Despesa" }) => 
        categoryService.delete(data.id, data.type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categorias_receitas"] });
      queryClient.invalidateQueries({ queryKey: ["categorias_despesas"] });
    },
  });

  // Handlers
  const handleSubmit = (data: any) => {
    const type = data.tipo as "Receita" | "Despesa";
    // Construct payload strictly? The form returns correct shape.
    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.id, type, payload: data });
    } else {
      createMutation.mutate({ type, payload: data });
    }
  };

  const handleEdit = (category: Categoria) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    // Optionally set default type based on active tab
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number, type: "Receita" | "Despesa") => {
      if(confirm(`Tem certeza que deseja excluir esta categoria de ${type}?`)) {
          deleteMutation.mutate({ id, type });
      }
  }

  const renderCategoryList = (categories: Categoria[] | undefined, isLoading: boolean, type: "Receita" | "Despesa") => {
      if (isLoading) return <div>Carregando...</div>;
      if (!categories || categories.length === 0) return <div>Nenhuma categoria encontrada.</div>;

      return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                  <Card key={cat.id}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                              {cat.nome}
                          </CardTitle>
                          <div className="flex gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)}>
                                  <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(cat.id, type)}>
                                  <Trash2 className="h-4 w-4" />
                              </Button>
                          </div>
                      </CardHeader>
                      <CardContent>
                          <div className="text-xs text-muted-foreground">
                              {cat.fixo ? `Fixo: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cat.valorFixo || 0)}` : "Variável"}
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nova Categoria
        </Button>
      </div>

      <Tabs defaultValue="Despesa" className="w-full" onValueChange={(val) => setActiveTab(val as "Receita" | "Despesa")}>
        <TabsList>
            <TabsTrigger value="Despesa">Despesas</TabsTrigger>
            <TabsTrigger value="Receita">Receitas</TabsTrigger>
        </TabsList>
        <TabsContent value="Despesa" className="mt-4">
            {renderCategoryList(despesas, isLoadingDespesas, "Despesa")}
        </TabsContent>
        <TabsContent value="Receita" className="mt-4">
            {renderCategoryList(receitas, isLoadingReceitas, "Receita")}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
            <DialogDescription>
              {selectedCategory ? "Edite os detalhes da categoria." : "Preencha os dados para criar uma nova categoria."}
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            onSubmit={handleSubmit}
            initialData={selectedCategory ? { ...selectedCategory, tipo: activeTab } : { tipo: activeTab }}
            loading={createMutation.isPending || updateMutation.isPending}
            isEditing={!!selectedCategory}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
