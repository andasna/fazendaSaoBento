import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { 
  Tractor, Fuel, TrendingUp, AlertTriangle, 
  Map, DollarSign, Sprout, 
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  MOCK_HARVESTS, 
  MOCK_FUEL, 
  MOCK_FINANCIAL, 
  MOCK_ACTIVITIES,
  MOCK_STOCK
} from "@/src/lib/mock-data";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
const FINANCIAL_COLORS = { recipe: '#10b981', expense: '#ef4444' };

export function Dashboard() {
  const { selectedSafra, selectedTalhao, talhoes } = useGlobalFilters();

  // ── Filtros de Dados ──
  const filteredHarvest = MOCK_HARVESTS.filter(h => {
    if (selectedSafra && h.safraId !== selectedSafra.id) return false;
    if (selectedTalhao && h.talhaoId !== selectedTalhao.id) return false;
    return true;
  });

  const filteredFinancial = MOCK_FINANCIAL.filter(f => {
    if (selectedSafra && f.safraId !== selectedSafra.id) return false;
    if (selectedTalhao && f.talhaoId && f.talhaoId !== selectedTalhao.id) return false;
    return true;
  });

  const filteredActivities = MOCK_ACTIVITIES.filter(a => {
    if (selectedSafra && a.safraId !== selectedSafra.id) return false;
    if (selectedTalhao && a.talhaoId !== selectedTalhao.id) return false;
    return true;
  });

  // ── Cálculos de KPIs ──
  const totalWeight = filteredHarvest.reduce((acc, curr) => acc + curr.pesoLiquido, 0);
  const totalBags = totalWeight / 60;
  const totalArea = filteredHarvest.reduce((acc, curr) => acc + curr.area, 0);
  const avgProductivity = totalArea > 0 ? totalBags / totalArea : 0;

  const totalIncome = filteredFinancial.filter(f => f.categoria === 'receita').reduce((a, b) => a + b.valor, 0);
  const totalExpense = filteredFinancial.filter(f => f.categoria === 'despesa').reduce((a, b) => a + b.valor, 0);
  const netBalance = totalIncome - totalExpense;

  const fuelConsumption = MOCK_FUEL.reduce((acc, curr) => acc + curr.liters, 0);
  const lowStockItems = MOCK_STOCK.filter(s => s.quantity < 100).length;

  // ── Preparação de Dados para Gráficos ──
  const financialData = [
    { name: 'Receitas', value: totalIncome, fill: FINANCIAL_COLORS.recipe },
    { name: 'Despesas', value: totalExpense, fill: FINANCIAL_COLORS.expense },
  ];

  const activityStatusMap = filteredActivities.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activityData = Object.keys(activityStatusMap).map(key => ({
    name: key,
    value: activityStatusMap[key]
  }));

  const productivityByTalhao = filteredHarvest.map(h => {
    const t = talhoes.find(tal => tal.id === h.talhaoId);
    return {
      name: t?.name || h.talhaoId,
      prod: (h.pesoLiquido / 60) / h.area
    };
  }).sort((a, b) => b.prod - a.prod).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Produtividade Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{avgProductivity.toFixed(1)} <span className="text-sm font-normal text-slate-500">scs/ha</span></div>
            <p className="text-[10px] text-slate-400 mt-1">Total: {Math.round(totalBags).toLocaleString()} sacas em {totalArea} ha</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Saldo Operacional</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(netBalance)}
            </div>
            <div className="flex gap-2 mt-1">
               <span className="text-[10px] text-emerald-500 flex items-center"><ArrowDownRight className="h-2 w-2 mr-0.5" /> +{ Math.round(totalIncome/1000) }k</span>
               <span className="text-[10px] text-red-400 flex items-center"><ArrowUpRight className="h-2 w-2 mr-0.5" /> -{ Math.round(totalExpense/1000) }k</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Consumo Diesel</CardTitle>
            <Fuel className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{fuelConsumption.toLocaleString()} <span className="text-sm font-normal text-slate-500">L</span></div>
            <p className="text-[10px] text-slate-400 mt-1">Geral da fazenda no período</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-slate-500 uppercase">Atividades Pendentes</CardTitle>
            <Activity className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {filteredActivities.filter(a => a.status === 'Agendada' || a.status === 'Em Andamento').length}
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{filteredActivities.filter(a => a.status === 'Concluída').length} concluídas nesta safra</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Balanço Financeiro (R$)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val), 'Valor']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Top Produtividade (scs/ha)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityByTalhao} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip 
                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="prod" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sprout className="h-4 w-4 text-indigo-500" />
              Status de Operações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Próximas Atividades</CardTitle>
            <Sprout className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Operação</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.filter(a => a.status !== 'Concluída').slice(0, 5).map((act) => {
                   const t = talhoes.find(tal => tal.id === act.talhaoId);
                   return (
                    <TableRow key={act.id}>
                      <TableCell className="pl-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">{act.tipo}</span>
                          <span className="text-[10px] text-slate-400 italic">{t?.name || act.talhaoId}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">{format(new Date(act.date), "dd/MM", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          act.status === 'Em Andamento' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {act.status}
                        </span>
                      </TableCell>
                    </TableRow>
                   );
                })}
                {filteredActivities.filter(a => a.status !== 'Concluída').length === 0 && (
                  <TableRow>
                     <TableCell colSpan={3} className="text-center py-8 text-slate-400">Nenhum agendamento pendente.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Desempenho da Colheita</CardTitle>
            <Tractor className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Talhão</TableHead>
                  <TableHead className="text-right">Sacas/ha</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHarvest.slice(0, 5).map((h) => {
                  const t = talhoes.find(tal => tal.id === h.talhaoId);
                  const bagsPerHa = (h.pesoLiquido / 60) / h.area;
                  return (
                    <TableRow key={h.id}>
                      <TableCell className="pl-4 font-medium text-slate-900">{t?.name || h.talhaoId}</TableCell>
                      <TableCell className="text-right text-sm">
                        <span className={`px-2 py-0.5 rounded font-bold ${bagsPerHa > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                          {bagsPerHa.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-500">{Math.round(h.pesoLiquido / 60).toLocaleString()} scs</TableCell>
                    </TableRow>
                  );
                })}
                {filteredHarvest.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={3} className="text-center py-8 text-slate-400">Dados de colheita indisponíveis.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
