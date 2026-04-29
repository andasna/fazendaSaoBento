import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tractor, Filter, Download, ChevronRight, Wrench, Ban, Activity } from 'lucide-react';
import { MOCK_MACHINES } from '@/src/lib/mock-data';
import { ActionDropdown } from '@/src/components/ui/action-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { FilterDrawer } from '@/src/components/ui/filter-drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { Button } from "@/src/components/ui/button";

interface Machine {
  id: string;
  name: string;
  type: string;
  brand: string;
  year: number;
  status: 'Ativa' | 'Manutenção' | 'Inativa';
}

export function Machines() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState<Machine[]>(MOCK_MACHINES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  
  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const filteredMachines = machines.filter(m => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(term) ||
      m.type.toLowerCase().includes(term) ||
      m.brand.toLowerCase().includes(term);
      
    const matchesType = !filterValues.type || m.type === filterValues.type;
    const matchesBrand = !filterValues.brand || m.brand === filterValues.brand;
    const matchesStatus = !filterValues.status || m.status === filterValues.status;

    return matchesSearch && matchesType && matchesBrand && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta máquina?')) {
      setMachines(machines.filter(m => m.id !== id));
    }
  };

  const uniqueTypes = Array.from(new Set(machines.map(m => m.type)));
  const uniqueBrands = Array.from(new Set(machines.map(m => m.brand)));

  const totalAtivas = machines.filter(m => m.status === 'Ativa').length;
  const totalManutencao = machines.filter(m => m.status === 'Manutenção').length;

  const MachineForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newMachine = {
        id: selectedMachine?.id || Date.now().toString(),
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        brand: formData.get('brand') as string,
        year: Number(formData.get('year')),
        status: formData.get('status') as any,
      };
      
      if (selectedMachine) {
        setMachines(machines.map(m => m.id === selectedMachine.id ? newMachine : m));
      } else {
        setMachines([...machines, newMachine]);
      }
      setIsModalOpen(false);
      setSelectedMachine(null);
    }} className="space-y-4 pb-4">
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome/Modelo</label>
        <input required name="name" defaultValue={selectedMachine?.name} placeholder="Ex: Trator 7G..." className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipo</label>
          <input required name="type" defaultValue={selectedMachine?.type} placeholder="Ex: Trator" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Marca</label>
          <input required name="brand" defaultValue={selectedMachine?.brand} placeholder="Ex: John Deere" className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Ano</label>
          <input required type="number" name="year" defaultValue={selectedMachine?.year || 2024} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
          <select required name="status" defaultValue={selectedMachine?.status || 'Ativa'} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30">
            <option value="Ativa">Ativa</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Inativa">Inativa</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1">Salvar</Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header — desktop */}
      <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tractor className="h-6 w-6 text-emerald-600" />
            Máquinas
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as máquinas e equipamentos da fazenda.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={() => setSelectedMachine(null)} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Nova Máquina
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>{selectedMachine ? 'Editar Máquina' : 'Nova Máquina'}</SheetTitle></SheetHeader>
            <MachineForm />
          </SheetContent>
        </Sheet>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1"><Tractor className="h-3.5 w-3.5" /><span className="text-[10px] font-medium uppercase tracking-tight">Total</span></div>
          <p className="text-lg font-bold text-slate-900">{machines.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1"><Activity className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Ativas</span></div>
          <p className="text-lg font-bold text-emerald-700">{totalAtivas}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-orange-500 mb-1"><Wrench className="h-3.5 w-3.5" /><span className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Manutenção</span></div>
          <p className="text-lg font-bold text-orange-700">{totalManutencao}</p>
        </div>
      </div>

      {/* Mobile Actions (Search + Filter + Add) */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar máquinas..."
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
            <button onClick={() => setSelectedMachine(null)} className="sm:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-emerald-600 text-white flex-shrink-0 active:bg-emerald-700">
              <Plus className="h-4 w-4" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4"><SheetTitle>{selectedMachine ? 'Editar Máquina' : 'Nova Máquina'}</SheetTitle></SheetHeader>
            <MachineForm />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Card List */}
      <div className="sm:hidden">
        <MobileCardList>
          {filteredMachines.map(m => (
            <MobileCard
              key={m.id}
              title={m.name}
              subtitle={`${m.type} · ${m.brand} (${m.year})`}
              badge={{ 
                label: m.status, 
                variant: m.status === 'Ativa' ? 'emerald' : m.status === 'Manutenção' ? 'amber' : 'slate' 
              }}
              onClick={() => navigate(`/admin/machines/${m.id}`)}
              actions={
                <ActionDropdown 
                  onEdit={() => {
                    setSelectedMachine(m);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => {
                    handleDelete(m.id);
                  }}
                />
              }
            />
          ))}
          {filteredMachines.length === 0 && <MobileCardEmpty icon={Tractor} message="Nenhuma máquina encontrada." />}
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
                <TableHead>Nome/Modelo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((machine) => (
                    <TableRow 
                      key={machine.id}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => navigate(`/admin/machines/${machine.id}`)}
                    >
                      <TableCell className="font-medium text-slate-900">{machine.name}</TableCell>
                      <TableCell>{machine.type}</TableCell>
                      <TableCell>{machine.brand}</TableCell>
                      <TableCell>{machine.year}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          machine.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' :
                          machine.status === 'Manutenção' ? 'bg-orange-100 text-orange-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {machine.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/machines/${machine.id}`)}
                            className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                          >
                            Ver <ChevronRight className="inline h-3 w-3" />
                          </button>
                          <ActionDropdown 
                            onEdit={() => {
                              setSelectedMachine(machine);
                              setIsModalOpen(true);
                            }}
                            onDelete={() => handleDelete(machine.id)}
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
        title="Filtrar Máquinas"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'type', label: 'Tipo', type: 'select', options: uniqueTypes as string[] },
          { key: 'brand', label: 'Marca', type: 'select', options: uniqueBrands as string[] },
          { key: 'status', label: 'Status', type: 'select', options: ['Ativa', 'Manutenção', 'Inativa'] }
        ]}
      />
    </div>
  );
}
