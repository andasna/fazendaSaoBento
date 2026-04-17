import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Modal } from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import {
  Plus, Search, Filter, Download,
  Sprout, SprayCan, Wheat, MoreHorizontal,
  ChevronRight, Layers
} from "lucide-react";
import { MOCK_ACTIVITIES, MOCK_STOCK } from "@/src/lib/mock-data";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Activity, ActivityType, ActivityProduct } from "@/src/lib/types";

const TIPO_LABELS: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  plantio: { label: 'Plantio', icon: Sprout, color: 'text-emerald-600 bg-emerald-50' },
  pulverizacao: { label: 'Pulverização', icon: SprayCan, color: 'text-blue-600 bg-blue-50' },
  colheita: { label: 'Colheita', icon: Wheat, color: 'text-amber-600 bg-amber-50' },
  outros: { label: 'Outros', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-100' },
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

  // ── Modal de criação ────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({
    tipo: 'plantio' as ActivityType,
    talhaoId: '',
    cultura: '',
    date: new Date().toISOString().slice(0, 10),
    observacao: '',
  });
  const [formProdutos, setFormProdutos] = useState<ActivityProduct[]>([]);

  // ── Filtros ─────────────────────────────────────────────────
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => setFilterValues({});

  const filtered = activities.filter(a => {
    if (selectedSafra && a.safraId !== selectedSafra.id) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (
        !a.cultura.toLowerCase().includes(term) &&
        !TIPO_LABELS[a.tipo].label.toLowerCase().includes(term)
      ) return false;
    }
    if (filterValues.tipo && a.tipo !== filterValues.tipo) return false;
    if (filterValues.talhaoId && a.talhaoId !== filterValues.talhaoId) return false;
    return true;
  });

  // ── KPIs ────────────────────────────────────────────────────
  const totalCusto = filtered.reduce((a, act) => a + act.custoTotal, 0);
  const byTipo = (tipo: ActivityType) => filtered.filter(a => a.tipo === tipo).length;

  // ── Adicionar produto ao form ───────────────────────────────
  const addProduct = () => {
    setFormProdutos(prev => [...prev, { stockItemId: '', nome: '', quantidade: 0, unidade: 'kg' }]);
  };
  const removeProduct = (index: number) => {
    setFormProdutos(prev => prev.filter((_, i) => i !== index));
  };
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

  // ── Criar atividade ─────────────────────────────────────────
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const custoTotal = formProdutos.reduce((a, p) => a + p.quantidade * 10, 0); // custo estimado mock

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Atividades</h1>
          <p className="text-sm text-slate-500 mt-1">Registro de plantio, pulverização, colheita e outras operações.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Atividade
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Total de Atividades</p>
          <p className="text-xl font-bold text-slate-900">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs text-slate-500 mb-1">Custo Total</p>
          <p className="text-xl font-bold text-red-600">{formatBRL(totalCusto)}</p>
        </div>
        <div className="bg-white rounded-xl border border-emerald-200 p-4 shadow-sm bg-emerald-50/50">
          <p className="text-xs text-emerald-600 mb-1">Plantios</p>
          <p className="text-xl font-bold text-emerald-700">{byTipo('plantio')}</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm bg-blue-50/50">
          <p className="text-xs text-blue-600 mb-1">Pulverizações</p>
          <p className="text-xl font-bold text-blue-700">{byTipo('pulverizacao')}</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-sm bg-amber-50/50">
          <p className="text-xs text-amber-600 mb-1">Colheitas</p>
          <p className="text-xl font-bold text-amber-700">{byTipo('colheita')}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cultura ou tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${
                Object.values(filterValues).some(v => v !== '')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </button>
          </div>
        </div>

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
              {filtered.map((act) => {
                const tipoInfo = TIPO_LABELS[act.tipo];
                const TipoIcon = tipoInfo.icon;
                const talhao = talhoesForSafra.find(t => t.id === act.talhaoId);

                return (
                  <TableRow
                    key={act.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => navigate(`/activities/${act.id}`)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(act.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tipoInfo.color}`}>
                        <TipoIcon className="h-3 w-3" />
                        {tipoInfo.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">{act.cultura}</TableCell>
                    <TableCell>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                        {talhao?.name ?? act.talhaoId}
                      </span>
                    </TableCell>
                    <TableCell>
                      {act.produtos.length > 0 ? (
                        <span className="text-xs text-slate-600">
                          {act.produtos.length} {act.produtos.length === 1 ? 'produto' : 'produtos'}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {act.custoTotal > 0 ? formatBRL(act.custoTotal) : '—'}
                    </TableCell>
                    <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/activities/${act.id}`)}
                          className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50"
                        >
                          Ver <ChevronRight className="inline h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(act.id)}
                          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded"
                        >
                          Excluir
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                    <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    Nenhuma atividade encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Atividades"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'tipo',
            label: 'Tipo',
            type: 'select',
            options: Object.keys(TIPO_LABELS),
          },
          {
            key: 'talhaoId',
            label: 'Talhão',
            type: 'select',
            options: talhoesForSafra.map(t => t.id),
          },
        ]}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova Atividade">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select value={form.tipo}
                onChange={e => setForm(p => ({ ...p, tipo: e.target.value as ActivityType }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {Object.entries(TIPO_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
              <input type="date" required value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Talhão</label>
              <select value={form.talhaoId} required
                onChange={e => setForm(p => ({ ...p, talhaoId: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Selecione...</option>
                {talhoesForSafra.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cultura</label>
              <input type="text" required value={form.cultura}
                onChange={e => setForm(p => ({ ...p, cultura: e.target.value }))}
                placeholder="Ex: Soja, Milho..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Observação</label>
              <input type="text" value={form.observacao}
                onChange={e => setForm(p => ({ ...p, observacao: e.target.value }))}
                placeholder="Observações opcionais..."
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          {/* Produtos utilizados */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-700">Produtos Utilizados</label>
              <button type="button" onClick={addProduct}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">
                + Adicionar Produto
              </button>
            </div>
            {formProdutos.length === 0 && (
              <p className="text-xs text-slate-400 py-2">Nenhum produto adicionado.</p>
            )}
            {formProdutos.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <select value={prod.stockItemId}
                  onChange={e => updateProduct(idx, 'stockItemId', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm">
                  <option value="">Produto...</option>
                  {MOCK_STOCK.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.quantity} {s.unit})</option>
                  ))}
                </select>
                <input type="number" min="0" value={prod.quantidade || ''}
                  onChange={e => updateProduct(idx, 'quantidade', +e.target.value)}
                  placeholder="Qtd"
                  className="w-20 px-2 py-1.5 border border-slate-200 rounded text-sm" />
                <span className="text-xs text-slate-500 w-8">{prod.unidade}</span>
                <button type="button" onClick={() => removeProduct(idx)}
                  className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Atividade</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
