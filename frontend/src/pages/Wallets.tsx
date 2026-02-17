import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Wallet as WalletIcon, Building2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { WalletForm } from "../components/wallets/WalletForm";
import { walletService, CreateCarteiraRequest, UpdateCarteiraRequest } from "../services/walletService";
import { domainService } from "../services/domainService";

export default function Wallets() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<any>(null);

  // Fetch Data
  const { data: wallets, isLoading: isLoadingWallets } = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getAll,
  });

  const { data: bancos } = useQuery({
    queryKey: ["bancos"],
    queryFn: domainService.getBancos,
  });

  const { data: tiposCarteira } = useQuery({
    queryKey: ["tiposCarteira"],
    queryFn: domainService.getTiposCarteira,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: walletService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setIsDialogOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; payload: UpdateCarteiraRequest }) =>
      walletService.update(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      setIsDialogOpen(false);
      setSelectedWallet(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: walletService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  // Handlers
  const handleSubmit = (data: CreateCarteiraRequest | UpdateCarteiraRequest) => {
    if (selectedWallet) {
      updateMutation.mutate({ id: selectedWallet.id, payload: data as UpdateCarteiraRequest });
    } else {
      createMutation.mutate(data as CreateCarteiraRequest);
    }
  };

  const handleEdit = (wallet: any) => {
    setSelectedWallet(wallet);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedWallet(null);
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: number) => {
      if(confirm("Tem certeza que deseja excluir esta carteira?")) {
          deleteMutation.mutate(id);
      }
  }

  if (isLoadingWallets) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Carteiras</h2>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Nova Carteira
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets?.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {wallet.tipoCarteiraNome}
              </CardTitle>
              {wallet.bancoNome ? <Building2 className="h-4 w-4 text-muted-foreground" /> : <WalletIcon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start pt-4">
                  <div>
                    <div className="text-2xl font-bold">{wallet.nome}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {wallet.bancoNome ? wallet.bancoNome : "Sem banco vinculado"}
                    </p>
                    <div className={`text-lg font-bold mt-2 ${wallet.saldoAtual >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(wallet.saldoAtual)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(wallet)}>
                          <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(wallet.id)}>
                          <Trash2 className="h-4 w-4" />
                      </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedWallet ? "Editar Carteira" : "Nova Carteira"}</DialogTitle>
            <DialogDescription>
              {selectedWallet ? "Edite os detalhes da carteira abaixo." : "Preencha os dados para criar uma nova carteira."}
            </DialogDescription>
          </DialogHeader>
          <WalletForm
            onSubmit={handleSubmit}
            initialData={selectedWallet}
            bancos={bancos || []}
            tiposCarteira={tiposCarteira || []}
            loading={createMutation.isPending || updateMutation.isPending}
            isEditing={!!selectedWallet}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
