import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Calendar, CheckCircle2, Clock, Wallet } from "lucide-react";
import { invoiceService } from "../services/invoiceService";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export default function Invoices() {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: invoiceService.getAll,
  });

  const payMutation = useMutation({
    mutationFn: invoiceService.pagar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      alert("Fatura paga com sucesso!");
    },
    onError: (error: any) => {
      alert(error.response?.data || "Erro ao pagar fatura.");
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground text-lg">Carregando faturas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Faturas</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {invoices?.map((fatura) => (
          <Card key={fatura.id} className={fatura.fechada ? "opacity-75" : "border-primary/20"}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">{fatura.cartaoNome}</CardTitle>
              </div>
              <Badge variant={fatura.fechada ? "secondary" : "outline"} className="font-semibold">
                {fatura.fechada ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Paga
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Aberta
                  </span>
                )}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Referência:</span>
                  </div>
                  <span className="text-sm font-bold">{fatura.competenciaFormatada}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-4 w-4" />
                    <span className="text-sm">Valor Total:</span>
                  </div>
                  <span className="text-xl font-black text-primary">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fatura.valorTotal)}
                  </span>
                </div>

                {!fatura.fechada && (
                  <Button 
                    className="w-full shadow-lg shadow-primary/20" 
                    onClick={() => payMutation.mutate(fatura.id)}
                    disabled={payMutation.isPending || fatura.valorTotal <= 0}
                  >
                    {payMutation.isPending ? "Processando..." : "Pagar Fatura"}
                  </Button>
                )}
                
                {fatura.fechada && fatura.dataFechamento && (
                  <div className="text-xs text-center text-muted-foreground border-t pt-2">
                    Paga em {new Date(fatura.dataFechamento).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {invoices?.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-muted rounded-xl p-12 text-center bg-card/50">
            <CreditCard className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-bold text-foreground">Ainda não há faturas</h3>
            <p className="text-muted-foreground text-lg mt-2">
              As faturas serão geradas automaticamente assim que você realizar lançamentos utilizando cartões de crédito.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
