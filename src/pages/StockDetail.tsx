import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Package, Calendar, Tag, Activity,
  ArrowUpRight, ArrowDownRight, Info, DollarSign, Sprout
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { MOCK_STOCK, MOCK_STOCK_MOVEMENTS } from "@/src/lib/mock-data";

export function StockDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const item = MOCK_STOCK.find(s => s.id === id);
  const itemMovements = MOCK_STOCK_MOVEMENTS.filter(m => m.stockId === id).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Package className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Insumo não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/stock')}>
          Voltar para Estoque
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Mobile Header */}
      <MobileHeader
        title={item.name}
        subtitle={`${item.category} · ${item.unit}`}
        onBack={() => navigate('/stock')}
      />
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={() => navigate('/stock')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{item.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{item.category} · {item.unit}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Saldo Atual</span>
            <Package className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-700">
            {item.quantity.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-500">{item.unit}</span>
          </p>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Última atualização: {format(new Date(item.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Última Entrada</span>
            <ArrowDownRight className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {itemMovements.find(m => m.type === 'Entrada')?.quantity.toLocaleString('pt-BR') || '0'} {item.unit}
          </p>
          <p className="text-xs text-slate-400 mt-2">NF: {itemMovements.find(m => m.type === 'Entrada')?.document || '—'}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Último Uso</span>
            <ArrowUpRight className="h-4 w-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {itemMovements.find(m => m.type === 'Saída')?.quantity.toLocaleString('pt-BR') || '0'} {item.unit}
          </p>
          <p className="text-xs text-slate-400 mt-2">Destino: {itemMovements.find(m => m.type === 'Saída')?.destination || '—'}</p>
        </div>
      </div>

      {/* Histórico de Movimentações */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            Histórico Completo
          </h2>
          <button className="text-sm text-emerald-600 font-medium hover:underline">
            Exportar Histórico
          </button>
        </div>
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-500" />
            Histórico Completo
          </h2>
          <button className="text-sm text-emerald-600 font-medium hover:underline">
            Exportar Histórico
          </button>
        </div>
        {/* Mobile: cards */}
        <div className="sm:hidden">
          <MobileCardList>
            {itemMovements.map((mov) => (
              <MobileCard
                key={mov.id}
                title={`${mov.type} — ${mov.document}`}
                subtitle={`${format(new Date(mov.date), "dd/MM/yyyy HH:mm", { locale: ptBR })} · ${mov.user}`}
                detail={mov.destination ? `Destino: ${mov.destination}` : undefined}
                badge={{ label: mov.type, variant: mov.type === 'Entrada' ? 'emerald' : 'red' }}
                value={`${mov.type === 'Entrada' ? '+' : '-'}${mov.quantity.toLocaleString('pt-BR')} ${item.unit}`}
                valueColor={mov.type === 'Entrada' ? 'emerald' : 'red'}
                onClick={() => {
                  if (mov.financialRecordId) navigate(`/financial/${mov.financialRecordId}`);
                  else if (mov.activityId) navigate(`/activities/${mov.activityId}`);
                }}
              />
            ))}
            {itemMovements.length === 0 && (
              <MobileCardEmpty icon={Activity} message="Nenhuma movimentação encontrada." />
            )}
          </MobileCardList>
        </div>
        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Operação</TableHead>
                <TableHead className="text-right">Qtd</TableHead>
                <TableHead>Referência</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itemMovements.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell className="whitespace-nowrap text-slate-600">
                    {format(new Date(mov.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      mov.type === 'Entrada' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {mov.type === 'Entrada' ? <ArrowDownRight className="h-3 w-3 mr-1" /> : <ArrowUpRight className="h-3 w-3 mr-1" />}
                      {mov.type}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${
                    mov.type === 'Entrada' ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {mov.type === 'Entrada' ? '+' : '-'}{mov.quantity.toLocaleString('pt-BR')} {item.unit}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700">{mov.document}</span>
                      {mov.destination && <span className="text-xs text-slate-400">Destino: {mov.destination}</span>}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">{mov.user}</TableCell>
                  <TableCell className="text-right">
                    {mov.financialRecordId && (
                      <button 
                        onClick={() => navigate(`/financial/${mov.financialRecordId}`)}
                        className="text-[10px] text-blue-600 hover:underline uppercase font-bold tracking-tight"
                        title="Ver registro financeiro"
                      >
                        <DollarSign className="inline h-3 w-3 mr-0.5" /> Financeiro
                      </button>
                    )}
                    {mov.activityId && (
                      <button 
                        onClick={() => navigate(`/activities/${mov.activityId}`)}
                        className="text-[10px] text-emerald-600 hover:underline uppercase font-bold tracking-tight"
                        title="Ver atividade"
                      >
                        <Sprout className="inline h-3 w-3 mr-0.5" /> Atividade
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {itemMovements.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                    Nenhuma movimentação para este insumo.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
