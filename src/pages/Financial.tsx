import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import {
  Plus, Search, Filter, Download,
  DollarSign, Calendar, CreditCard, ArrowUpCircle, ArrowDownCircle
} from "lucide-react";
import { MOCK_FINANCIAL } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button as Btn } from "@/src/components/ui/button";
import type { FinancialRecord, FinancialType, FinancialStatus, FinancialCategory } from "@/src/lib/types";

const TIPO_LABELS: Record<FinancialType, string> = {
  maquina: 'Máquina', estoque: 'Estoque/Insumos', colheita: 'Colheita',
  administrativo: 'Administrativo', diesel: 'Diesel', outros: 'Outros',
};

const STATUS_COLORS: Record<FinancialStatus, { bg: string; text: string }> = {
  aberto: { bg: 'bg-amber-50', text: 'text-amber-700' },
  pago: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

const formatBRL = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function Financial() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<FinancialRecord[]>(MOCK_FINANCIAL);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    fornecedor: '', descricao: '',
    categoria: 'despesa' as FinancialCategory, tipo: 'outros' as FinancialType,
    valor: 0, banco: '', vencimento: '', totalParcelas: 1,
  });

  const handleFilterChange = (key: string, value: string) => setFilterValues(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilterValues({});

  const filtered = records.filter(r => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!r.fornecedor.toLowerCase().includes(term) && !r.descricao.toLowerCase().includes(term)) return false;
    }
    if (filterValues.tipo && r.tipo !== filterValues.tipo) return false;
    if (filterValues.status && r.status !== filterValues.status) return false;
    if (filterValues.categoria && r.categoria !== filterValues.categoria) return false;
    return true;
  });

  const totalReceitas = filtered.filter(r => r.categoria === 'receita').reduce((a, r) => a + r.valor, 0);
  const totalDespesas = filtered.filter(r => r.categoria === 'despesa').reduce((a, r) => a + r.valor, 0);
  const saldo = totalReceitas - totalDespesas;
  const totalAberto = filtered.filter(r => r.status === 'aberto').reduce((a, r) => a + r.valor, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const groupId = `pg${Date.now()}`;
    const novos: FinancialRecord[] = [];
    for (let i = 1; i <= form.totalParcelas; i++) {
      const vencDate = new Date(form.vencimento);
      vencDate.setMonth(vencDate.getMonth() + (i - 1));
      novos.push({
        id: `fin_${Date.now()}_${i}`, date: form.date, fornecedor: form.fornecedor,
        descricao: form.descricao, categoria: form.categoria, tipo: form.tipo,
        valor: form.valor / form.totalParcelas, banco: form.banco,
        vencimento: vencDate.toISOString().slice(0, 10), status: 'aberto',
        parcela: i, totalParcelas: form.totalParcelas, parcelamentoGroupId: groupId,
      });
    }
    setRecords(prev => [...novos, ...prev]);
    setIsCreateOpen(false);
    setForm({ date: new Date().toISOString().slice(0, 10), fornecedor: '', descricao: '', categoria: 'despesa', tipo: 'outros', valor: 0, banco: '', vencimento: '', totalParcelas: 1 });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este registro?')) setRecords(prev => prev.filter(r => r.id !== id));
  };

  const toggleStatus = (id: string) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'pago' ? 'aberto' as const : 'pago' as const } : r));
  };

  const CreateFormContent = () => (
    <form onSubmit={handleCreate} className="space-y-3 pb-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fornecedor / Loja</label>
        <input type="text" required value={form.fornecedor} onChange={e => setForm(p => ({ ...p, fornecedor: e.target.value }))}
          placeholder="Ex: AgroShop..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Produto / Descrição</label>
        <input type="text" required value={form.descricao} onChange={e => setForm(p => ({ ...p, descricao: e.target.value }))}
          placeholder="Ex: Fertilizante NPK..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Categoria</label>
          <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value as FinancialCategory }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
          <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value as FinancialType }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            {Object.entries(TIPO_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Valor Total (R$)</label>
          <input type="number" required min="0" step="0.01" value={form.valor || ''} onChange={e => setForm(p => ({ ...p, valor: +e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Banco</label>
          <input type="text" required value={form.banco} onChange={e => setForm(p => ({ ...p, banco: e.target.value }))}
            placeholder="Ex: Sicredi..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data</label>
          <input type="date" required value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">1º Vencimento</label>
          <input type="date" required value={form.vencimento} onChange={e => setForm(p => ({ ...p, vencimento: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nº de Parcelas</label>
          <input type="number" required min="1" max="48" value={form.totalParcelas} onChange={e => setForm(p => ({ ...p, totalParcelas: +e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
          {form.totalParcelas > 1 && <p className="text-xs text-blue-600 mt-1">{form.totalParcelas}x de {formatBRL(form.valor / form.totalParcelas)}</p>}
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Btn variant="outline" type="button" onClick={() => setIsCreateOpen(false)} className="flex-1">Cancelar</Btn>
        <Btn type="submit" className="flex-1">Salvar</Btn>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
          <p className="text-sm text-slate-500 mt-1">Controle de receitas, despesas e parcelamentos.</p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Novo Registro
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>Novo Registro Financeiro</SheetTitle></SheetHeader>
            <CreateFormContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* KPIs — 2x2 em mobile */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1"><ArrowUpCircle className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500">Receitas</span></div>
          <p className="text-base sm:text-lg font-bold text-emerald-700">{formatBRL(totalReceitas)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-red-500 mb-1"><ArrowDownCircle className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500">Despesas</span></div>
          <p className="text-base sm:text-lg font-bold text-red-600">{formatBRL(totalDespesas)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 mb-1"><DollarSign className={`h-3.5 w-3.5 ${saldo >= 0 ? 'text-emerald-600' : 'text-red-500'}`} /><span className="text-[10px] font-medium text-slate-500">Saldo</span></div>
          <p className={`text-base sm:text-lg font-bold ${saldo >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{formatBRL(saldo)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-amber-500 mb-1"><Calendar className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500">Em Aberto</span></div>
          <p className="text-base sm:text-lg font-bold text-amber-700">{formatBRL(totalAberto)}</p>
        </div>
      </div>

      {/* Busca + filtro + novo (mobile) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar fornecedor..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <button onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 transition-colors ${Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
          <Filter className="h-4 w-4" />
        </button>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>Novo Registro Financeiro</SheetTitle></SheetHeader>
            <CreateFormContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden">
        <MobileCardList>
          {filtered.map(r => (
            <MobileCard
              key={r.id}
              title={r.fornecedor}
              subtitle={`${r.descricao.slice(0, 40)}${r.descricao.length > 40 ? '…' : ''}`}
              detail={`${format(new Date(r.date), "dd/MM/yyyy", { locale: ptBR })} · ${TIPO_LABELS[r.tipo]}`}
              badge={{ label: r.status === 'pago' ? 'Pago' : 'Em Aberto', variant: r.status === 'pago' ? 'emerald' : 'amber' }}
              value={`${r.categoria === 'receita' ? '+' : '-'}${formatBRL(r.valor)}`}
              valueColor={r.categoria === 'receita' ? 'emerald' : 'red'}
              onClick={() => navigate(`/financial/${r.id}`)}
            />
          ))}
          {filtered.length === 0 && <MobileCardEmpty icon={DollarSign} message="Nenhum registro encontrado." />}
        </MobileCardList>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-2 justify-end">
          <button onClick={() => setIsFilterOpen(true)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'}`}>
            <Filter className="mr-2 h-4 w-4" />Filtros
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
            <Download className="mr-2 h-4 w-4" />Exportar
          </button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Banco</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Parcela</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(r => (
                <TableRow key={r.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/financial/${r.id}`)}>
                  <TableCell className="whitespace-nowrap">{format(new Date(r.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="font-medium text-slate-900 max-w-[150px] truncate">{r.fornecedor}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-slate-600">{r.descricao}</TableCell>
                  <TableCell><span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">{TIPO_LABELS[r.tipo]}</span></TableCell>
                  <TableCell className="text-right"><span className={`font-semibold ${r.categoria === 'receita' ? 'text-emerald-700' : 'text-red-600'}`}>{r.categoria === 'receita' ? '+' : '-'}{formatBRL(r.valor)}</span></TableCell>
                  <TableCell className="text-slate-600 text-xs">{r.banco}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs">{format(new Date(r.vencimento), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell>{r.totalParcelas > 1 && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"><CreditCard className="h-3 w-3 mr-1" />{r.parcela}/{r.totalParcelas}</span>}</TableCell>
                  <TableCell><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status].bg} ${STATUS_COLORS[r.status].text}`}>{r.status === 'pago' ? 'Pago' : 'Em Aberto'}</span></TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleStatus(r.id)} className={`text-xs px-2 py-1 rounded font-medium ${r.status === 'pago' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                        {r.status === 'pago' ? 'Reabrir' : 'Pagar'}
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded">Excluir</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-10 text-slate-500"><DollarSign className="h-8 w-8 text-slate-300 mx-auto mb-2" />Nenhum registro encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar Financeiro"
        filterValues={filterValues} onFilterChange={handleFilterChange} onClearFilters={clearFilters}
        filters={[
          { key: 'categoria', label: 'Categoria', type: 'select', options: ['receita', 'despesa'] },
          { key: 'tipo', label: 'Tipo', type: 'select', options: Object.keys(TIPO_LABELS) },
          { key: 'status', label: 'Status', type: 'select', options: ['aberto', 'pago'] },
        ]}
      />
    </div>
  );
}
