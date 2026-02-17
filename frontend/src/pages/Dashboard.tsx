import { useEffect, useState } from "react";
import api from "../services/api";
import { StatCard } from "../components/dashboard/DashboardStats";
import { DashboardChart } from "../components/dashboard/DashboardChart";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2, ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet, GripVertical, CreditCard } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

interface DashboardSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  saldoAccumulated: number;
  totalLimiteCartoes: number;
  totalFaturaAtual: number;
}

interface WalletBalance {
  carteira: string;
  banco: string;
  saldo: number;
}

interface CreditCardSummary {
  cartao: string;
  banco: string;
  limiteTotal: number;
  faturaAtual: number;
  fechada: boolean;
}

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("relative group", className)}>
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-2 right-2 p-1 bg-muted rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

// Utility to merge tailwind classes
function cn(...classes: (string | undefined | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [wallets, setWallets] = useState<WalletBalance[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCardSummary[]>([]);
  
  // Persistence for card order
  const [statsOrder, setStatsOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboard_stats_order");
    return saved ? JSON.parse(saved) : ["receitas", "despesas", "saldo", "acumulado", "fatura_atual", "limite_disponivel"];
  });

  const [mainOrder, setMainOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem("dashboard_main_order");
    return saved ? JSON.parse(saved) : ["chart", "wallets", "credit-cards"];
  });

  // Date state
  const currentDate = new Date();
  const [mes, setMes] = useState(currentDate.getMonth() + 1);
  const [ano, setAno] = useState(currentDate.getFullYear());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchDashboardData();
  }, [mes, ano]);

  useEffect(() => {
    localStorage.setItem("dashboard_stats_order", JSON.stringify(statsOrder));
  }, [statsOrder]);

  useEffect(() => {
    localStorage.setItem("dashboard_main_order", JSON.stringify(mainOrder));
  }, [mainOrder]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const summaryRes = await api.get<DashboardSummary>(`/dashboard/summary?mes=${mes}&ano=${ano}`);
      const walletsRes = await api.get<WalletBalance[]>('/dashboard/wallets');
      const cardsRes = await api.get<CreditCardSummary[]>(`/dashboard/credit-cards?mes=${mes}&ano=${ano}`);
      
      setSummary(summaryRes.data);
      setWallets(walletsRes.data);
      setCreditCards(cardsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEndStats = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setStatsOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEndMain = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMainOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" },
  ];

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const renderStatCard = (id: string) => {
    if (!summary) return null;
    switch (id) {
      case "receitas":
        return (
          <StatCard 
            key="receitas"
            title="Receitas"
            value={summary.totalReceitas}
            icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
            description="No período selecionado"
            valueClassName="text-green-600"
          />
        );
      case "despesas":
        return (
          <StatCard 
            key="despesas"
            title="Despesas"
            value={summary.totalDespesas}
            icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
            description="No período selecionado"
            valueClassName="text-red-600"
          />
        );
      case "saldo":
        return (
          <StatCard 
            key="saldo"
            title="Saldo do Período"
            value={summary.saldo}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            description="Receitas - Despesas"
            valueClassName={summary.saldo >= 0 ? 'text-blue-600' : 'text-red-600'}
          />
        );
      case "acumulado":
        return (
          <StatCard 
            key="acumulado"
            title="Saldo Total Acumulado"
            value={summary.saldoAccumulated}
            icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
            description="Soma de todas as carteiras"
          />
        );
      case "fatura_atual":
        return (
          <StatCard 
            key="fatura_atual"
            title="Total Faturas"
            value={summary.totalFaturaAtual}
            icon={<CreditCard className="h-4 w-4 text-primary" />}
            description="Lançamentos no cartão este mês"
            valueClassName="text-orange-600"
          />
        );
      case "limite_disponivel":
        return (
          <StatCard 
            key="limite_disponivel"
            title="Limite Total"
            value={summary.totalLimiteCartoes}
            icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
            description="Soma de todos os limites"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
            <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[120px]"
                value={mes}
                onChange={(e) => setMes(Number(e.target.value))}
            >
                {months.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                ))}
            </select>
            <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-w-[100px]"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
            >
                {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndStats}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={statsOrder} strategy={rectSortingStrategy}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsOrder.map((id) => (
              <SortableItem key={id} id={id}>
                {renderStatCard(id)}
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEndMain}
        modifiers={[restrictToWindowEdges]}
      >
        <SortableContext items={mainOrder} strategy={verticalListSortingStrategy}>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {mainOrder.map((id) => {
              if (id === "chart") {
                return (
                  <SortableItem key="chart" id="chart" className="lg:col-span-4">
                    {summary && <DashboardChart receitas={summary.totalReceitas} despesas={summary.totalDespesas} />}
                  </SortableItem>
                );
              }
              if (id === "wallets") {
                return (
                  <SortableItem key="wallets" id="wallets" className="lg:col-span-3">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Carteiras</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                            {wallets.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhuma carteira encontrada.</p>
                            ) : (
                                wallets.map((wallet, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{wallet.carteira}</p>
                                            <p className="text-xs text-muted-foreground">{wallet.banco}</p>
                                        </div>
                                        <div className="font-bold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(wallet.saldo)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </SortableItem>
                );
              }
              if (id === "credit-cards") {
                return (
                  <SortableItem key="credit-cards" id="credit-cards" className="lg:col-span-3">
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Cartões de Crédito</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                            {creditCards.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum cartão encontrado.</p>
                            ) : (
                                creditCards.map((card, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium">{card.cartao}</p>
                                            <p className="text-xs text-muted-foreground">{card.banco}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-red-600">
                                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.faturaAtual)}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground">
                                              de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limiteTotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </SortableItem>
                );
              }
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
