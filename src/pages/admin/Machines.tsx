import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tractor, Filter, Download, ChevronRight } from 'lucide-react';
import { MOCK_MACHINES } from '@/src/lib/mock-data';
import { ActionDropdown } from '@/src/components/ui/action-dropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { FilterDrawer } from '@/src/components/ui/filter-drawer';

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
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
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

  // Get unique values for filters
  const uniqueTypes = Array.from(new Set(machines.map(m => m.type)));
  const uniqueBrands = Array.from(new Set(machines.map(m => m.brand)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tractor className="h-6 w-6 text-emerald-600" />
            Máquinas
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as máquinas e equipamentos da fazenda.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedMachine(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Máquina
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar máquinas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border h-10 px-4 py-2 ${
                Object.keys(filterValues).length > 0 && Object.values(filterValues).some(v => v !== '')
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtros {Object.keys(filterValues).length > 0 && Object.values(filterValues).some(v => v !== '') && '(Ativo)'}
            </button>
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 h-10 px-4 py-2">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </button>
          </div>
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
                      <TableCell className="text-right flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/admin/machines/${machine.id}`)}
                          className="text-xs text-slate-500 hover:text-emerald-600 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
                        >
                           Ver Detalhes <ChevronRight className="inline h-3 w-3" />
                        </button>
                        <ActionDropdown 
                          onEdit={() => {
                            setSelectedMachine(machine);
                            setIsModalOpen(true);
                          }}
                          onDelete={() => handleDelete(machine.id)}
                        />
                      </TableCell>
                    </TableRow>
              ))}
              {filteredMachines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Nenhuma máquina encontrada.
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
        title="Filtrar Máquinas"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          {
            key: 'type',
            label: 'Tipo',
            type: 'select',
            options: uniqueTypes
          },
          {
            key: 'brand',
            label: 'Marca',
            type: 'select',
            options: uniqueBrands
          },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: ['Ativa', 'Manutenção', 'Inativa']
          }
        ]}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {selectedMachine ? 'Editar Máquina' : 'Nova Máquina'}
              </h2>
            </div>
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
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome/Modelo</label>
                <input required name="name" defaultValue={selectedMachine?.name} className="w-full p-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <input required name="type" defaultValue={selectedMachine?.type} className="w-full p-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                <input required name="brand" defaultValue={selectedMachine?.brand} className="w-full p-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ano</label>
                <input required type="number" name="year" defaultValue={selectedMachine?.year} className="w-full p-2 border border-slate-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select required name="status" defaultValue={selectedMachine?.status || 'Ativa'} className="w-full p-2 border border-slate-200 rounded-lg">
                  <option value="Ativa">Ativa</option>
                  <option value="Manutenção">Manutenção</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
