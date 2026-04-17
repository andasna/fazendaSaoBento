import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Package, ChevronRight } from "lucide-react";
import { MOCK_STOCK } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Modal } from "@/src/components/ui/modal";

export function Stock() {
  const navigate = useNavigate();
  const [stock, setStock] = useState(MOCK_STOCK);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // ── Modal de criação ──
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', unit: 'kg' });

  // ── Filtros ──
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };
  const clearFilters = () => setFilterValues({});

  const filteredStock = stock.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterValues.category && item.category !== filterValues.category) return false;
    return true;
  });

  const uniqueCategories = Array.from(new Set(stock.map(s => s.category)));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const novo = {
      id: Date.now().toString(),
      ...form,
      quantity: 0,
      lastUpdate: new Date().toISOString()
    };
    setStock(prev => [novo, ...prev]);
    setIsCreateOpen(false);
    setForm({ name: '', category: '', unit: 'kg' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estoque de Insumos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie produtos, sementes e defensivos.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Insumo
        </button>
      </div>

      {/* Tabela Principal */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar insumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${
                filterValues.category ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Quantidade Atual</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/stock/${item.id}`)}
                >
                  <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {item.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-700">
                    {item.quantity.toLocaleString('pt-BR')} {item.unit}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs">
                    {format(new Date(item.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/stock/${item.id}`)}
                      className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                    >
                      Ver detalhes <ChevronRight className="inline h-3 w-3" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                    <Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    Nenhum insumo encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Insumos"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'category',
            label: 'Categoria',
            type: 'select',
            options: uniqueCategories
          }
        ]}
      />

      {/* Modal de Criação */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Novo Insumo">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
            <input
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
              <select
                required
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Selecione...</option>
                <option value="Sementes">Sementes</option>
                <option value="Fertilizantes">Fertilizantes</option>
                <option value="Defensivos">Defensivos</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Unidade</label>
              <select
                required
                value={form.unit}
                onChange={e => setForm({ ...form, unit: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="un">un</option>
                <option value="ton">ton</option>
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t mt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button type="submit">Salvar Insumo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
