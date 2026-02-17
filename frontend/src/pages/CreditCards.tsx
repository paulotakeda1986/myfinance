import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, CreditCard as CreditCardIcon, Building2, Receipt, Calendar } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { CreditCardForm } from "../components/cards/CreditCardForm";
import { creditCardService, CreateCartaoCreditoRequest, UpdateCartaoCreditoRequest } from "../services/creditCardService";
import { walletService } from "../services/walletService";
import { domainService } from "../services/domainService";
import { invoiceService } from "../services/invoiceService";
import { Badge } from "../components/ui/badge";

export default function CreditCards() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);
  const [viewingCardInvoices, setViewingCardInvoices] = useState<{id: number, nome: string} | null>(null);

  // Fetch Data
  const { data: cards, isLoading: isLoadingCards } = useQuery({
    queryKey: ["creditCards"],
    queryFn: creditCardService.getAll,
  });

  const { data: bancos } = useQuery({
    queryKey: ["bancos"],
    queryFn: domainService.getBancos,
  });

  const { data: wallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: creditCardService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: UpdateCartaoCreditoRequest }) =>
      creditCardService.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
      setIsDialogOpen(false);
      setSelectedCard(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: creditCardService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditCards"] });
    },
  });

  const { data: allInvoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoiceService.getAll,
  });

  const payMutation = useMutation({
    mutationFn: invoiceService.pagar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["creditCards"] }); 
      alert("Fatura paga com sucesso!");
    },
    onError: (error: any) => {
      alert(error.response?.data || "Erro ao pagar fatura.");
    },
  });

  // Handlers
  const handleSubmit = (data: any) => {
    if (selectedCard) {
      updateMutation.mutate({ id: selectedCard.id, payload: data as UpdateCartaoCreditoRequest });
    } else {
      createMutation.mutate(data as CreateCartaoCreditoRequest);
    }
  };

  const handleEdit = (card: any) => {
    setSelectedCard(card);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCard(null);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este cartão?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewInvoices = (card: any) => {
    setViewingCardInvoices({ id: card.id, nome: card.nome });
    setIsInvoiceDialogOpen(true);
  };

  if (isLoadingCards) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Carregando cartões...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cartões de Crédito</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Novo Cartão
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards?.map((card) => (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.bancoNome || "Sem Banco"}
              </CardTitle>
              {card.bancoNome ? <Building2 className="h-4 w-4 text-muted-foreground" /> : <CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start pt-4">
                <div className="flex-1">
                  <div className="text-2xl font-bold">{card.nome}</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Limite Total:</span>
                      <span className="font-medium">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limiteTotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Carteira:</span>
                      <span className="font-medium">{card.carteiraNome || "Não vinculada"}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-primary h-full transition-all" 
                        style={{ width: `${Math.min(100, Math.max(0, (card.limiteAtual / card.limiteTotal) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button variant="ghost" size="icon" title="Ver Faturas" onClick={() => handleViewInvoices(card)}>
                    <Receipt className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(card)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(card.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {cards?.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-muted rounded-lg p-12 text-center bg-card/50">
            <CreditCardIcon className="mx-auto h-12 w-12 text-primary/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground">Nenhum cartão encontrado</h3>
            <p className="text-muted-foreground mb-6 max-w-xs mx-auto text-lg leading-relaxed">
              Comece adicionando seu primeiro cartão de crédito para gerenciar seu limite.
            </p>
            <Button onClick={handleCreate} size="lg" className="shadow-lg hover:shadow-primary/20">
              <Plus className="mr-2 h-5 w-5" /> Adicionar Primeiro Cartão
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* ... existing form content ... */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCard ? "Editar Cartão" : "Novo Cartão"}</DialogTitle>
            <DialogDescription>
              {selectedCard ? "Edite os detalhes do cartão abaixo." : "Preencha os dados para cadastrar um novo cartão de crédito."}
            </DialogDescription>
          </DialogHeader>
          <CreditCardForm
            onSubmit={handleSubmit}
            initialData={selectedCard}
            bancos={bancos || []}
            carteiras={wallets || []}
            loading={createMutation.isPending || updateMutation.isPending}
            isEditing={!!selectedCard}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Faturas - {viewingCardInvoices?.nome}</DialogTitle>
            <DialogDescription>
              Gerencie as faturas mensais deste cartão.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 md:grid-cols-2 mt-4">
            {allInvoices?.filter(f => f.cartaoCreditoId === viewingCardInvoices?.id).length === 0 ? (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                    Nenhuma fatura encontrada para este cartão.
                </div>
            ) : (
                allInvoices?.filter(f => f.cartaoCreditoId === viewingCardInvoices?.id).map((fatura) => (
                    <Card key={fatura.id} className={fatura.fechada ? "opacity-75" : "border-primary/20"}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-medium">{fatura.competenciaFormatada}</CardTitle>
                            </div>
                            <Badge variant={fatura.fechada ? "secondary" : "outline"} className="font-semibold">
                                {fatura.fechada ? "Paga" : "Aberta"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground font-medium">Valor Total:</span>
                                    <span className="text-lg font-black text-primary">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valorTotal)}
                                    </span>
                                </div>
                                {!fatura.fechada && (
                                    <Button 
                                        className="w-full" 
                                        onClick={() => payMutation.mutate(fatura.id)}
                                        disabled={payMutation.isPending || fatura.valorTotal <= 0}
                                    >
                                        {payMutation.isPending ? "Processando..." : "Pagar Agora"}
                                    </Button>
                                )}
                                {fatura.fechada && fatura.dataFechamento && (
                                    <p className="text-[10px] text-center text-muted-foreground uppercase border-t pt-2 mt-2">
                                        Quitada em {new Date(fatura.dataFechamento).toLocaleDateString("pt-BR")}
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
