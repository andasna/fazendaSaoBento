import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Truck as TruckIcon, ChevronRight, Activity, Wrench } from "lucide-react";
import { MOCK_TRUCKS } from "@/src/lib/mock-data";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";

export function Trucks() {
  const navigate = useNavigate();
  const [trucks, setTrucks] = useState(MOCK_TRUCKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [formData, setFormData] = useState({ plate: '', model: '', capacity: 0, status: 'Ativo' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const filteredTrucks = trucks.filter(t => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = t.plate.toLowerCase().includes(term) || 
                          t.model.toLowerCase().includes(term);
    const matchesModel = !filterValues.model || t.model === filterValues.model;
    const matchesStatus = !filterValues.status || t.status === filterValues.status;
    return matchesSearch && matchesModel && matchesStatus;
  });

  const uniqueModels = Array.from(new Set(trucks.map(t => t.model)));
  const uniqueStatuses = Array.from(new Set(trucks.map(t => t.status)));

  const totalAtivos = trucks.filter(t => t.status === 'Ativo').length;
  const totalManutencao = trucks.filter(t => t.status === 'Manutenção').length;

  const openNew = () => {
    setModalMode('new');
    setFormData({ plate: '', model: '', capacity: 0, status: 'Ativo' });
    setIsModalOpen(true);
  };

  const openEdit = (truck: any) => {
    setModalMode('edit');
    setSelectedTruck(truck);
    setFormData({ ...truck });
    setIsModalOpen(true);
  };

  const openDelete = (truck: any) => {
    setModalMode('delete');
    setSelectedTruck(truck);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setTrucks(trucks.filter(t => t.id !== selectedTruck.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setTrucks([...trucks, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setTrucks(trucks.map(t => t.id === selectedTruck.id ? { ...t, ...formData } : t));
    }
    setIsModalOpen(false);
  };

  const TruckForm = () => (
    <div className="space-y-4 pb-4">
      {modalMode === 'delete' ? (
        <div className="space-y-4">
          <p className="text-slate-700">Tem certeza que deseja excluir o caminhão <strong>{selectedTruck?.plate}</strong>?</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} className="flex-1">Excluir</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Placa</label>
            <input 
              required 
              value={formData.plate} 
              onChange={e => setFormData({...formData, plate: e.target.value})}
              placeholder="Ex: ABC-1234"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Modelo</label>
            <input 
              required 
              value={formData.model} 
              onChange={e => setFormData({...formData, model: e.target.value})}
              placeholder="Ex: Volvo FH 540"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Capacidade (ton)</label>
              <input 
                type="number"
                required 
                value={formData.capacity} 
                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                <option value="Ativo">Ativo</option>
                <option value="Manutenção">Manutenção</option>
              </select>
            </div>
          </div>
          <div className="pt-2 flex gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1">Salvar</Button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <TruckIcon className="h-6 w-6 text-emerald-600" />
            Frota de Caminhões
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os caminhões, placas e capacidades.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Novo Caminhão
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Novo Caminhão' : modalMode === 'edit' ? 'Editar Caminhão' : 'Excluir Caminhão'}
              </SheetTitle>
            </SheetHeader>
            <TruckForm />
          </SheetContent>
        </Sheet>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1"><TruckIcon className="h-3.5 w-3.5" /><span className="text-[10px] font-medium uppercase tracking-tight">Total</span></div>
          <p className="text-lg font-bold text-slate-900">{trucks.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1"><Activity className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Ativos</span></div>
          <p className="text-lg font-bold text-emerald-700">{totalAtivos}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-orange-500 mb-1"><Wrench className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Manutenção</span></div>
          <p className="text-lg font-bold text-orange-700">{totalManutencao}</p>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar caminhão..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center h-10 w-10 rounded-xl border flex-shrink-0 transition-colors ${
            Object.values(filterValues).some(v => v !== '') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'
          }`}
        >
          <Filter className="h-4 w-4" />
        </button>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Novo Caminhão' : modalMode === 'edit' ? 'Editar Caminhão' : 'Excluir Caminhão'}
              </SheetTitle>
            </SheetHeader>
            <TruckForm />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden">
        <MobileCardList>
          {filteredTrucks.map(t => (
            <MobileCard
              key={t.id}
              title={t.plate}
              subtitle={`${t.model} · Cap: ${t.capacity} ton`}
              badge={{ 
                label: t.status, 
                variant: t.status === 'Ativo' ? 'emerald' : 'amber' 
              }}
              onClick={() => navigate(`/admin/trucks/${t.id}`)}
              actions={
                <ActionDropdown 
                  onEdit={() => openEdit(t)}
                  onDelete={() => openDelete(t)}
                />
              }
            />
          ))}
          {filteredTrucks.length === 0 && <MobileCardEmpty icon={TruckIcon} message="Nenhum caminhão encontrado." />}
        </MobileCardList>
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-end gap-2">
           <button className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />Exportar
            </button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Placa</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Capacidade (ton)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrucks.map((truck) => (
                    <TableRow 
                      key={truck.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/admin/trucks/${truck.id}`)}
                    >
                      <TableCell>
                        <div className="inline-flex items-center justify-center px-3 py-1 rounded bg-slate-200 border border-slate-300 text-slate-800 font-mono font-bold text-sm shadow-sm">
                          {truck.plate}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-slate-900">{truck.model}</TableCell>
                      <TableCell>{truck.capacity}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          truck.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {truck.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/trucks/${truck.id}`)}
                            className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                          >
                            Ver <ChevronRight className="inline h-3 w-3" />
                          </button>
                          <ActionDropdown 
                            onEdit={() => openEdit(truck)} 
                            onDelete={() => openDelete(truck)} 
                          />
                        </div>
                      </TableCell>
                    </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filtrar Caminhões"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'model', label: 'Modelo', type: 'select', options: uniqueModels as string[] },
          { key: 'status', label: 'Status', type: 'select', options: uniqueStatuses as string[] }
        ]}
      />
    </div>
  );
}
