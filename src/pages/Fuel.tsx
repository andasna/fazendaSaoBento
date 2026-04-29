import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import {
  Search, Filter, Download,
  Fuel as FuelIcon, ArrowDownRight, Droplets
} from "lucide-react";
import { MOCK_MOVEMENTS, MOCK_FUEL, MOCK_MACHINES, MOCK_DRIVERS } from "@/src/lib/mock-data";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";

const formatBRL = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function Fuel() {
  const navigate = useNavigate();
  const { selectedSafra } = useGlobalFilters();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 16), equipment: '', employee: '', liters: 0, cost: 0 });

  const handleFilterChange = (key: string, value: string) => setFilterValues(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilterValues({});

  const filteredFuel = MOCK_FUEL.filter(f => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!f.equipment.toLowerCase().includes(term) && !f.employee.toLowerCase().includes(term)) return false;
    }
    if (filterValues.equipment && f.equipment !== filterValues.equipment) return false;
    return true;
  });

  const totalLitros = filteredFuel.reduce((a, f) => a + f.liters, 0);
  const totalCusto = filteredFuel.reduce((a, f) => a + f.cost, 0);
  const entradas = MOCK_MOVEMENTS.filter(m => m.type === 'Entrada').reduce((a, m) => a + m.liters, 0);
  const balance = entradas - MOCK_FUEL.reduce((a, f) => a + f.liters, 0);
  const uniqueEquipments = Array.from(new Set(MOCK_FUEL.map(f => f.equipment)));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateOpen(false);
  };

  const CreateFormContent = () => (
    <form onSubmit={handleCreate} className="space-y-4 pb-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Data e Hora</label>
        <input type="datetime-local" required value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Equipamento</label>
          <select required value={form.equipment} onChange={e => setForm({ ...form, equipment: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="">Selecione...</option>
            {MOCK_MACHINES.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Operador</label>
          <select required value={form.employee} onChange={e => setForm({ ...form, employee: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="">Selecione...</option>
            {MOCK_DRIVERS.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Litros</label>
          <input type="number" required min="1" value={form.liters || ''}
            onChange={e => setForm({ ...form, liters: +e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Custo (R$)</label>
          <input type="number" required min="0" step="0.01" value={form.cost || ''}
            onChange={e => setForm({ ...form, cost: +e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Salvar</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Controle de Diesel</h1>
          <p className="text-sm text-slate-500 mt-1">Gestão de estoque de combustível e abastecimentos.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/financial')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-10 px-4 py-2">
            <ArrowDownRight className="mr-2 h-4 w-4 text-emerald-600" />Nova Entrada
          </button>
          <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <SheetTrigger asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
                <Droplets className="mr-2 h-4 w-4" />Abastecer
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
              <SheetHeader className="mb-4"><SheetTitle>Novo Abastecimento</SheetTitle></SheetHeader>
              <CreateFormContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Saldo Tanque</p>
          <p className="text-base sm:text-xl font-bold text-emerald-700">{balance.toLocaleString('pt-BR')} L</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Consumido</p>
          <p className="text-base sm:text-xl font-bold text-orange-600">{totalLitros.toLocaleString('pt-BR')} L</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Custo Total</p>
          <p className="text-base sm:text-xl font-bold text-red-600">{formatBRL(totalCusto)}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <p className="text-[10px] sm:text-xs text-slate-500 mb-0.5">Custo/L</p>
          <p className="text-base sm:text-xl font-bold text-slate-900">{formatBRL(totalCusto / (totalLitros || 1))}</p>
        </div>
      </div>

      {/* Busca + filtro + novo mobile */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Buscar equipamento..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <button onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 ${filterValues.equipment ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
          <Filter className="h-4 w-4" />
        </button>
        <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <SheetTrigger asChild>
            <button className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Droplets className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>Novo Abastecimento</SheetTitle></SheetHeader>
            <CreateFormContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile: cards */}
      <div className="sm:hidden">
        <MobileCardList>
          {filteredFuel.map(f => (
            <MobileCard
              key={f.id}
              title={f.equipment}
              subtitle={`${f.employee} · ${format(new Date(f.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}`}
              value={`${f.liters.toLocaleString('pt-BR')} L`}
              valueColor="default"
              onClick={() => navigate(`/fuel/${f.id}`)}
            />
          ))}
          {filteredFuel.length === 0 && <MobileCardEmpty icon={FuelIcon} message="Nenhum abastecimento encontrado." />}
        </MobileCardList>
      </div>

      {/* Desktop: tabela */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-2 justify-end">
          <button onClick={() => setIsFilterOpen(true)}
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium border h-10 px-4 py-2 ${filterValues.equipment ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'}`}>
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
                <TableHead>Data/Hora</TableHead>
                <TableHead>Equipamento</TableHead>
                <TableHead>Motorista/Operador</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">Custo Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFuel.map(f => (
                <TableRow key={f.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/fuel/${f.id}`)}>
                  <TableCell className="whitespace-nowrap text-slate-600">{format(new Date(f.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{f.equipment}</TableCell>
                  <TableCell className="text-slate-600">{f.employee}</TableCell>
                  <TableCell className="text-right font-bold text-orange-600">{f.liters.toLocaleString('pt-BR')} L</TableCell>
                  <TableCell className="text-right font-medium text-slate-900">{formatBRL(f.cost)}</TableCell>
                </TableRow>
              ))}
              {filteredFuel.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-500"><FuelIcon className="h-8 w-8 text-slate-300 mx-auto mb-2" />Nenhum abastecimento encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} title="Filtrar Abastecimentos"
        filterValues={filterValues} onFilterChange={handleFilterChange} onClearFilters={clearFilters}
        filters={[{ key: 'equipment', label: 'Equipamento', type: 'select', options: uniqueEquipments }]}
      />
    </div>
  );
}
