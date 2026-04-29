import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Tractor, Fuel, TrendingUp, AlertTriangle,
  Map, DollarSign, Sprout,
  ArrowUpRight, ArrowDownRight, Activity, Layers, Wheat
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
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'];
const FINANCIAL_COLORS = { recipe: '#10b981', expense: '#ef4444' };

const statusBadgeVariant = (status: string) => {
  if (status === 'Em Andamento') return 'blue' as const;
  if (status === 'Agendada') return 'amber' as const;
  return 'slate' as const;
};

export function Dashboard() {
  const { selectedSafra, selectedTalhao, talhoes } = useGlobalFilters();
  const navigate = useNavigate();

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

  // ── KPIs ──
  const totalWeight = filteredHarvest.reduce((acc, curr) => acc + curr.pesoLiquido, 0);
  const totalBags = totalWeight / 60;
  const totalArea = filteredHarvest.reduce((acc, curr) => acc + curr.area, 0);
  const avgProductivity = totalArea > 0 ? totalBags / totalArea : 0;

  const totalIncome = filteredFinancial.filter(f => f.categoria === 'receita').reduce((a, b) => a + b.valor, 0);
  const totalExpense = filteredFinancial.filter(f => f.categoria === 'despesa').reduce((a, b) => a + b.valor, 0);
  const netBalance = totalIncome - totalExpense;

  const fuelConsumption = MOCK_FUEL.reduce((acc, curr) => acc + curr.liters, 0);

  const pendingActivities = filteredActivities.filter(a => a.status === 'Agendada' || a.status === 'Em Andamento');

  // ── Dados de gráficos ──
  const financialData = [
    { name: 'Receitas', value: totalIncome, fill: FINANCIAL_COLORS.recipe },
    { name: 'Despesas', value: totalExpense, fill: FINANCIAL_COLORS.expense },
  ];

  const activityStatusMap = filteredActivities.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const activityData = Object.keys(activityStatusMap).map(key => ({
    name: key, value: activityStatusMap[key]
  }));

  const productivityByTalhao = filteredHarvest.map(h => {
    const t = talhoes.find(tal => tal.id === h.talhaoId);
    return { name: t?.name || h.talhaoId, prod: (h.pesoLiquido / 60) / h.area };
  }).sort((a, b) => b.prod - a.prod).slice(0, 5);

  return (
    <div className="space-y-5">
      {/* KPIs Grid — 2 colunas no mobile, 4 no desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-3 px-4">
            <CardTitle className="text-[10px] font-semibold text-slate-500 uppercase leading-tight">Produtividade</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold text-slate-900">{avgProductivity.toFixed(1)} <span className="text-xs font-normal text-slate-500">scs/ha</span></div>
            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{Math.round(totalBags).toLocaleString()} scs · {totalArea} ha</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-3 px-4">
            <CardTitle className="text-[10px] font-semibold text-slate-500 uppercase leading-tight">Saldo</CardTitle>
            <DollarSign className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className={`text-xl font-bold ${netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(netBalance)}
            </div>
            <div className="flex gap-2 mt-0.5">
              <span className="text-[10px] text-emerald-500 flex items-center"><ArrowDownRight className="h-2 w-2 mr-0.5" />+{Math.round(totalIncome / 1000)}k</span>
              <span className="text-[10px] text-red-400 flex items-center"><ArrowUpRight className="h-2 w-2 mr-0.5" />-{Math.round(totalExpense / 1000)}k</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-3 px-4">
            <CardTitle className="text-[10px] font-semibold text-slate-500 uppercase leading-tight">Diesel</CardTitle>
            <Fuel className="h-3.5 w-3.5 text-orange-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold text-slate-900">{fuelConsumption.toLocaleString()} <span className="text-xs font-normal text-slate-500">L</span></div>
            <p className="text-[10px] text-slate-400 mt-0.5">Total no período</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-1.5 pt-3 px-4">
            <CardTitle className="text-[10px] font-semibold text-slate-500 uppercase leading-tight">Pendentes</CardTitle>
            <Activity className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
          </CardHeader>
          <CardContent className="px-4 pb-3">
            <div className="text-xl font-bold text-slate-900">{pendingActivities.length}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">{filteredActivities.filter(a => a.status === 'Concluída').length} concluídas</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos — reduzidos em mobile */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              Balanço Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] sm:h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    formatter={(val: number) => [new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val), 'Valor']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Top Produtividade (scs/ha)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] sm:h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productivityByTalhao} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="prod" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Sprout className="h-4 w-4 text-indigo-500" />
              Status de Operações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] sm:h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activityData} cx="50%" cy="50%" innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value">
                    {activityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listas — MobileCard no mobile, tabela no desktop */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">

        {/* Próximas Atividades */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-400" />
              Próximas Atividades
            </CardTitle>
            <button onClick={() => navigate('/activities')} className="text-xs text-emerald-600 font-semibold hover:underline">Ver todas</button>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile: MobileCardList */}
            <div className="sm:hidden">
              <MobileCardList>
                {pendingActivities.slice(0, 5).map(act => {
                  const t = talhoes.find(tal => tal.id === act.talhaoId);
                  return (
                    <MobileCard
                      key={act.id}
                      title={act.tipo.charAt(0).toUpperCase() + act.tipo.slice(1)}
                      subtitle={`${t?.name || act.talhaoId} · ${format(new Date(act.date), "dd/MM", { locale: ptBR })}`}
                      badge={{ label: act.status, variant: statusBadgeVariant(act.status) }}
                      onClick={() => navigate(`/activities/${act.id}`)}
                    />
                  );
                })}
                {pendingActivities.length === 0 && (
                  <MobileCardEmpty icon={Layers} message="Nenhuma atividade pendente." />
                )}
              </MobileCardList>
            </div>
            {/* Desktop: tabela */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 pl-4 py-2.5">Operação</th>
                    <th className="text-left text-xs font-semibold text-slate-500 py-2.5">Data</th>
                    <th className="text-left text-xs font-semibold text-slate-500 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pendingActivities.slice(0, 5).map(act => {
                    const t = talhoes.find(tal => tal.id === act.talhaoId);
                    return (
                      <tr key={act.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/activities/${act.id}`)}>
                        <td className="pl-4 py-3">
                          <div className="font-medium text-slate-900">{act.tipo}</div>
                          <div className="text-[10px] text-slate-400">{t?.name || act.talhaoId}</div>
                        </td>
                        <td className="py-3 text-xs text-slate-500">{format(new Date(act.date), "dd/MM", { locale: ptBR })}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${act.status === 'Em Andamento' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            {act.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {pendingActivities.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-8 text-slate-400 text-xs">Nenhum agendamento pendente.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Desempenho da Colheita */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Wheat className="h-4 w-4 text-amber-400" />
              Desempenho da Colheita
            </CardTitle>
            <button onClick={() => navigate('/harvest')} className="text-xs text-emerald-600 font-semibold hover:underline">Ver todas</button>
          </CardHeader>
          <CardContent className="p-0">
            {/* Mobile: MobileCardList */}
            <div className="sm:hidden">
              <MobileCardList>
                {filteredHarvest.slice(0, 5).map(h => {
                  const t = talhoes.find(tal => tal.id === h.talhaoId);
                  const bagsPerHa = (h.pesoLiquido / 60) / h.area;
                  return (
                    <MobileCard
                      key={h.id}
                      title={t?.name || h.talhaoId}
                      subtitle={`${h.cultura} · ${h.area} ha`}
                      value={`${bagsPerHa.toFixed(1)} scs/ha`}
                      valueColor={bagsPerHa > 70 ? "emerald" : "default"}
                      onClick={() => navigate(`/harvest/${h.id}`)}
                    />
                  );
                })}
                {filteredHarvest.length === 0 && (
                  <MobileCardEmpty icon={Wheat} message="Dados de colheita indisponíveis." />
                )}
              </MobileCardList>
            </div>
            {/* Desktop: tabela */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-semibold text-slate-500 pl-4 py-2.5">Talhão</th>
                    <th className="text-right text-xs font-semibold text-slate-500 py-2.5">Sacas/ha</th>
                    <th className="text-right text-xs font-semibold text-slate-500 pr-4 py-2.5">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredHarvest.slice(0, 5).map(h => {
                    const t = talhoes.find(tal => tal.id === h.talhaoId);
                    const bagsPerHa = (h.pesoLiquido / 60) / h.area;
                    return (
                      <tr key={h.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/harvest/${h.id}`)}>
                        <td className="pl-4 py-3 font-medium text-slate-900">{t?.name || h.talhaoId}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded font-bold text-xs ${bagsPerHa > 70 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                            {bagsPerHa.toFixed(1)}
                          </span>
                        </td>
                        <td className="pr-4 py-3 text-right font-medium text-slate-500 text-xs">{Math.round(h.pesoLiquido / 60).toLocaleString()} scs</td>
                      </tr>
                    );
                  })}
                  {filteredHarvest.length === 0 && (
                    <tr><td colSpan={3} className="text-center py-8 text-slate-400 text-xs">Dados de colheita indisponíveis.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
