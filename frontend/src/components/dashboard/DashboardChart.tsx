import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface DashboardChartProps {
  receitas: number;
  despesas: number;
}

export function DashboardChart({ receitas, despesas }: DashboardChartProps) {
  const data = [
    {
      name: "Financeiro",
      Receitas: receitas,
      Despesas: despesas,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Visão Geral</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
                formatter={(value?: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0), "Valor"]}
                cursor={{fill: 'transparent'}}
            />
            <Legend />
            <Bar dataKey="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
