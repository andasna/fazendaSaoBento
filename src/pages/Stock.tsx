import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { Plus, Search, Filter, Download, Package } from "lucide-react";
import { MOCK_STOCK } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";

export function Stock() {
  const navigate = useNavigate();
  const [stock, setStock] = useState(MOCK_STOCK);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', unit: 'kg' });

  const handleFilterChange = (key: string, value: string) => setFilterValues(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilterValues({});

  const filteredStock = stock.filter(item => {
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterValues.category && item.category !== filterValues.category) return false;
    return true;
  });

  const uniqueCategories = Array.from(new Set(stock.map(s => s.category)));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setStock(prev => [{ id: Date.now().toString(), ...form, quantity: 0, lastUpdate: new Date().toISOString() }, ...prev]);
    setIsCreateOpen(false);
    setForm({ name: '', category: '', unit: 'kg' });
  };

  const CreateFormContent = () => (
    <form onSubmit={handleCreate} className="space-y-4 pb-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome do Produto</label>
        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Categoria</label>
          <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="">Selecione...</option>
            <option value="Sementes">Sementes</option>
            <option value="Fertilizantes">Fertilizantes</option>
            <option value="Defensivos">Defensivos</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unidade</label>
          <select required value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="kg">kg</option>
            <option value="L">L</option>
            <option value="un">un</option>
            <option value="ton">ton</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Salvar Insumo</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Estoque de Insumos</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie produtos, sementes e defensivos.</p>
        </div>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Novo Insumo
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>Novo Insumo</SheetTitle></SheetHeader>
            <CreateFormContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Busca + filtro + novo mobile */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar insumo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <button onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 transition-colors ${filterValues.category ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
          <Filter className="h-4 w-4" />
        </button>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>Novo Insumo</SheetTitle></SheetHeader>
            <CreateFormContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden">
        <MobileCardList>
          {filteredStock.map(item => (
            <MobileCard
              key={item.id}
              title={item.name}
              subtitle={`${item.category} · Atualizado ${format(new Date(item.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}`}
              badge={{ label: item.category, variant: 'slate' }}
              value={`${item.quantity.toLocaleString('pt-BR')} ${item.unit}`}
              valueColor={item.quantity < 100 ? 'red' : 'emerald'}
              onClick={() => navigate(`/stock/${item.id}`)}
            />
          ))}
          {filteredStock.length === 0 && <MobileCardEmpty icon={Package} message="Nenhum insumo encontrado." />}
        </MobileCardList>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-2 justify-end">
          <button onClick={() => setIsFilterOpen(true)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${filterValues.category ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'}`}>
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
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Quantidade Atual</TableHead>
                <TableHead>Última Atualização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStock.map(item => (
                <TableRow key={item.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/stock/${item.id}`)}>
                  <TableCell className="font-semibold text-slate-900">{item.name}</TableCell>
                  <TableCell><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{item.category}</span></TableCell>
                  <TableCell className="text-right font-bold text-emerald-700">{item.quantity.toLocaleString('pt-BR')} {item.unit}</TableCell>
                  <TableCell className="text-slate-500 text-xs">{format(new Date(item.lastUpdate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <button onClick={() => navigate(`/stock/${item.id}`)} className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50">Ver detalhes</button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStock.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500"><Package className="h-8 w-8 text-slate-300 mx-auto mb-2" />Nenhum insumo encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar Insumos"
        filterValues={filterValues} onFilterChange={handleFilterChange} onClearFilters={clearFilters}
        filters={[{ key: 'category', label: 'Categoria', type: 'select', options: uniqueCategories as string[] }]}
      />
    </div>
  );
}
