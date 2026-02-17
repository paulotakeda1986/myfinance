import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowDownIcon, ArrowUpIcon, DollarSign, Wallet } from "lucide-react";
import { cn } from "../../lib/utils";
import { useCounterAnimation } from "../../hooks/useCounterAnimation";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  className?: string;
  valueClassName?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  description, 
  className,
  valueClassName
}: StatCardProps) {
  const animatedValue = useCounterAnimation(value);
  
  return (
    <Card className={cn("transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(animatedValue)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  receitas: number;
  despesas: number;
  saldo: number;
  saldoAccumulated: number;
}

export function DashboardStats({ receitas, despesas, saldo, saldoAccumulated }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Receitas"
        value={receitas}
        icon={<ArrowUpIcon className="h-4 w-4 text-green-500" />}
        description="No período selecionado"
        valueClassName="text-green-600"
      />
      <StatCard 
        title="Despesas"
        value={despesas}
        icon={<ArrowDownIcon className="h-4 w-4 text-red-500" />}
        description="No período selecionado"
        valueClassName="text-red-600"
      />
      <StatCard 
        title="Saldo do Período"
        value={saldo}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        description="Receitas - Despesas"
        valueClassName={saldo >= 0 ? 'text-blue-600' : 'text-red-600'}
      />
      <StatCard 
        title="Saldo Total Acumulado"
        value={saldoAccumulated}
        icon={<Wallet className="h-4 w-4 text-muted-foreground" />}
        description="Soma de todas as carteiras"
      />
    </div>
  );
}
