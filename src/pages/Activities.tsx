import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import {
  Plus, Search, Filter,
  Sprout, SprayCan, Wheat, MoreHorizontal,
  Layers, X
} from "lucide-react";
import { MOCK_ACTIVITIES, MOCK_STOCK } from "@/src/lib/mock-data";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Activity, ActivityType, ActivityProduct } from "@/src/lib/types";

const TIPO_LABELS: Record<ActivityType, { label: string; icon: React.ElementType; color: string; badge: 'emerald' | 'blue' | 'amber' | 'slate' }> = {
  plantio:      { label: 'Plantio',      icon: Sprout,        color: 'text-emerald-600 bg-emerald-50', badge: 'emerald' },
  pulverizacao: { label: 'Pulverização', icon: SprayCan,      color: 'text-blue-600 bg-blue-50',       badge: 'blue'    },
  colheita:     { label: 'Colheita',     icon: Wheat,         color: 'text-amber-600 bg-amber-50',     badge: 'amber'   },
  outros:       { label: 'Outros',       icon: MoreHorizontal,color: 'text-slate-600 bg-slate-100',    badge: 'slate'   },
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function Activities() {
  const navigate = useNavigate();
  const { selectedSafra, talhoesForSafra } = useGlobalFilters();

  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // ── Criação via Sheet ──────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    tipo: 'plantio' as ActivityType,
    talhaoId: '',
    cultura: '',
    date: new Date().toISOString().slice(0, 10),
    observacao: '',
  });
  const [formProdutos, setFormProdutos] = useState<ActivityProduct[]>([]);

  // ── Filtros ──────────────────────────────────────────────
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => setFilterValues({});

  const filtered = activities.filter(a => {
    if (selectedSafra && a.safraId !== selectedSafra.id) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!a.cultura.toLowerCase().includes(term) && !TIPO_LABELS[a.tipo].label.toLowerCase().includes(term)) return false;
    }
    if (filterValues.tipo && a.tipo !== filterValues.tipo) return false;
    if (filterValues.talhaoId && a.talhaoId !== filterValues.talhaoId) return false;
    return true;
  });

  // ── KPIs ─────────────────────────────────────────────────
  const totalCusto = filtered.reduce((a, act) => a + act.custoTotal, 0);
  const byTipo = (tipo: ActivityType) => filtered.filter(a => a.tipo === tipo).length;

  // ── Produtos ────────────────────────────────────────────
  const addProduct = () => setFormProdutos(prev => [...prev, { stockItemId: '', nome: '', quantidade: 0, unidade: 'kg' }]);
  const removeProduct = (index: number) => setFormProdutos(prev => prev.filter((_, i) => i !== index));
  const updateProduct = (index: number, field: keyof ActivityProduct, value: string | number) => {
    setFormProdutos(prev => prev.map((p, i) => {
      if (i !== index) return p;
      if (field === 'stockItemId') {
        const item = MOCK_STOCK.find(s => s.id === value);
        return { ...p, stockItemId: value as string, nome: item?.name ?? '', unidade: item?.unit ?? 'kg' };
      }
      return { ...p, [field]: value };
    }));
  };

  // ── Criar ─────────────────────────────────────────────
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const custoTotal = formProdutos.reduce((a, p) => a + p.quantidade * 10, 0);
    const nova: Activity = {
      id: `act_${Date.now()}`,
      tipo: form.tipo,
      talhaoId: form.talhaoId,
      safraId: selectedSafra?.id ?? '1',
      cultura: form.cultura,
      date: new Date(form.date).toISOString(),
      produtos: formProdutos,
      custoTotal,
      observacao: form.observacao || undefined,
      status: 'Agendada',
    };
    setActivities(prev => [nova, ...prev]);
    setIsCreateOpen(false);
    setForm({ tipo: 'plantio', talhaoId: '', cultura: '', date: new Date().toISOString().slice(0, 10), observacao: '' });
    setFormProdutos([]);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir esta atividade?')) {
      setActivities(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop only (mobile usa header do Layout) */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Atividades</h1>
          <p className="text-sm text-slate-500 mt-1">Registro de plantio, pulverização, colheita e outras operações.</p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />
              Nova Atividade
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-5">
              <SheetTitle>Nova Atividade</SheetTitle>
            </SheetHeader>
            <CreateForm
              form={form} setForm={setForm}
              formProdutos={formProdutos}
              addProduct={addProduct} removeProduct={removeProduct} updateProduct={updateProduct}
              talhoesForSafra={talhoesForSafra}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-4">
        <KpiCard label="Total" value={String(filtered.length)} />
        <KpiCard label="Custo" value={formatBRL(totalCusto)} color="text-red-600" />
        <KpiCard label="Plantios" value={String(byTipo('plantio'))} color="text-emerald-700" variant="emerald" />
        <KpiCard label="Pulv." value={String(byTipo('pulverizacao'))} color="text-blue-700" variant="blue" />
        <KpiCard label="Colheitas" value={String(byTipo('colheita'))} color="text-amber-700" variant="amber" />
      </div>

      {/* Barra busca + filtro + botão novo (mobile) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-colors flex-shrink-0 ${Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}
        >
          <Filter className="h-4 w-4" />
        </button>
        {/* Botão novo — mobile */}
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-5">
              <SheetTitle>Nova Atividade</SheetTitle>
            </SheetHeader>
            <CreateForm
              form={form} setForm={setForm}
              formProdutos={formProdutos}
              addProduct={addProduct} removeProduct={removeProduct} updateProduct={updateProduct}
              talhoesForSafra={talhoesForSafra}
              onSubmit={handleCreate}
              onCancel={() => setIsCreateOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile: MobileCardList */}
      <div className="sm:hidden">
        <MobileCardList>
          {filtered.map(act => {
            const tipoInfo = TIPO_LABELS[act.tipo];
            const talhao = talhoesForSafra.find(t => t.id === act.talhaoId);
            return (
              <MobileCard
                key={act.id}
                title={tipoInfo.label}
                subtitle={`${talhao?.name ?? act.talhaoId} · ${format(new Date(act.date), "dd/MM/yyyy", { locale: ptBR })}`}
                detail={act.cultura}
                badge={{ label: tipoInfo.label, variant: tipoInfo.badge, icon: tipoInfo.icon }}
                value={act.custoTotal > 0 ? formatBRL(act.custoTotal) : undefined}
                valueColor="red"
                onClick={() => navigate(`/activities/${act.id}`)}
              />
            );
          })}
          {filtered.length === 0 && <MobileCardEmpty icon={Layers} message="Nenhuma atividade encontrada." />}
        </MobileCardList>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cultura</TableHead>
                <TableHead>Talhão</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead className="text-right">Custo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(act => {
                const tipoInfo = TIPO_LABELS[act.tipo];
                const TipoIcon = tipoInfo.icon;
                const talhao = talhoesForSafra.find(t => t.id === act.talhaoId);
                return (
                  <TableRow key={act.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/activities/${act.id}`)}>
                    <TableCell className="whitespace-nowrap">{format(new Date(act.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoInfo.color}`}>
                        <TipoIcon className="h-3 w-3" />{tipoInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{act.cultura}</TableCell>
                    <TableCell><span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-medium">{talhao?.name ?? act.talhaoId}</span></TableCell>
                    <TableCell><span className="text-xs text-slate-600">{act.produtos.length > 0 ? `${act.produtos.length} produto(s)` : '—'}</span></TableCell>
                    <TableCell className="text-right font-medium text-red-600">{act.custoTotal > 0 ? formatBRL(act.custoTotal) : '—'}</TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleDelete(act.id)} className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded">Excluir</button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-500"><Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />Nenhuma atividade encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Atividades"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'tipo', label: 'Tipo', type: 'select', options: Object.keys(TIPO_LABELS) },
          { key: 'talhaoId', label: 'Talhão', type: 'select', options: talhoesForSafra.map(t => t.id) },
        ]}
      />
    </div>
  );
}

// ── Sub-componentes locais ────────────────────────────────

function KpiCard({ label, value, color = "text-slate-900", variant }: { label: string; value: string; color?: string; variant?: string }) {
  const bg = variant === 'emerald' ? 'bg-emerald-50/50 border-emerald-100'
    : variant === 'blue' ? 'bg-blue-50/50 border-blue-100'
    : variant === 'amber' ? 'bg-amber-50/50 border-amber-100'
    : 'bg-white border-slate-200';
  return (
    <div className={`rounded-xl border p-3 shadow-sm ${bg}`}>
      <p className="text-[10px] text-slate-500 mb-0.5 truncate">{label}</p>
      <p className={`text-base font-bold truncate ${color}`}>{value}</p>
    </div>
  );
}

function CreateForm({ form, setForm, formProdutos, addProduct, removeProduct, updateProduct, talhoesForSafra, onSubmit, onCancel }: any) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pb-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
          <select value={form.tipo} onChange={e => setForm((p: any) => ({ ...p, tipo: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="plantio">Plantio</option>
            <option value="pulverizacao">Pulverização</option>
            <option value="colheita">Colheita</option>
            <option value="outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data</label>
          <input type="date" required value={form.date} onChange={e => setForm((p: any) => ({ ...p, date: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Talhão</label>
          <select value={form.talhaoId} required onChange={e => setForm((p: any) => ({ ...p, talhaoId: e.target.value }))}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="">Selecione...</option>
            {talhoesForSafra.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cultura</label>
          <input type="text" required value={form.cultura} onChange={e => setForm((p: any) => ({ ...p, cultura: e.target.value }))}
            placeholder="Ex: Soja, Milho..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Observação</label>
          <input type="text" value={form.observacao} onChange={e => setForm((p: any) => ({ ...p, observacao: e.target.value }))}
            placeholder="Observações opcionais..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold text-slate-600">Produtos Utilizados</span>
          <button type="button" onClick={addProduct} className="text-xs text-emerald-600 font-semibold">+ Adicionar</button>
        </div>
        {formProdutos.map((prod: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <select value={prod.stockItemId} onChange={e => updateProduct(idx, 'stockItemId', e.target.value)}
              className="flex-1 px-2 py-2 border border-slate-200 rounded-lg text-sm">
              <option value="">Produto...</option>
              {MOCK_STOCK.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input type="number" min="0" value={prod.quantidade || ''} onChange={e => updateProduct(idx, 'quantidade', +e.target.value)}
              placeholder="Qtd" className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm" />
            <span className="text-xs text-slate-500 w-6">{prod.unidade}</span>
            <button type="button" onClick={() => removeProduct(idx)} className="text-red-400 hover:text-red-600 w-6 h-6 flex items-center justify-center">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Salvar</Button>
      </div>
    </form>
  );
}
