import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Calendar } from "lucide-react";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useGlobalFilters } from "@/src/contexts/GlobalFiltersContext";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";

export function Safras() {
  const { safras, setSafras } = useGlobalFilters();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedSafra, setSelectedSafra] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', status: 'Ativa' });
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

  const filteredSafras = safras.filter(s => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(term);
    const matchesStatus = !filterValues.status || s.status === filterValues.status;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(safras.map(s => s.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', startDate: '', endDate: '', status: 'Ativa' });
    setIsModalOpen(true);
  };

  const openEdit = (safra: any) => {
    setModalMode('edit');
    setSelectedSafra(safra);
    setFormData({ 
      name: safra.name, 
      startDate: safra.startDate, 
      endDate: safra.endDate, 
      status: safra.status 
    });
    setIsModalOpen(true);
  };

  const openDelete = (safra: any) => {
    setModalMode('delete');
    setSelectedSafra(safra);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setSafras(safras.filter(s => s.id !== selectedSafra.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setSafras([...safras, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setSafras(safras.map(s => s.id === selectedSafra.id ? { ...s, ...formData } : s));
    }
    setIsModalOpen(false);
  };

  const SafraForm = () => (
    <div className="space-y-4 pb-4">
      {modalMode === 'delete' ? (
        <div className="space-y-4">
          <p className="text-slate-700">Tem certeza que deseja excluir a safra <strong>{selectedSafra?.name}</strong>?</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} className="flex-1">Excluir</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome da Safra</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              placeholder="Ex: Safra 2023/2024"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Início</label>
              <input 
                type="date"
                required 
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fim</label>
              <input 
                type="date"
                required 
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Planejada">Planejada</option>
              <option value="Ativa">Ativa</option>
              <option value="Concluída">Concluída</option>
            </select>
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
            <Calendar className="h-6 w-6 text-emerald-600" />
            Gestão de Safras
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as safras, períodos e status.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Nova Safra
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Nova Safra' : modalMode === 'edit' ? 'Editar Safra' : 'Excluir Safra'}
              </SheetTitle>
            </SheetHeader>
            <SafraForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar safra..."
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
                {modalMode === 'new' ? 'Nova Safra' : modalMode === 'edit' ? 'Editar Safra' : 'Excluir Safra'}
              </SheetTitle>
            </SheetHeader>
            <SafraForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="sm:hidden">
        <MobileCardList>
          {filteredSafras.map(s => (
            <MobileCard
              key={s.id}
              title={s.name}
              subtitle={`${format(new Date(s.startDate), "dd/MM/yy")} até ${format(new Date(s.endDate), "dd/MM/yy")}`}
              badge={{ 
                label: s.status, 
                variant: s.status === 'Ativa' ? 'emerald' : s.status === 'Planejada' ? 'blue' : 'slate' 
              }}
              hideChevron
              actions={
                <ActionDropdown 
                  onEdit={() => openEdit(s)}
                  onDelete={() => openDelete(s)}
                />
              }
            />
          ))}
          {filteredSafras.length === 0 && <MobileCardEmpty icon={Calendar} message="Nenhuma safra encontrada." />}
        </MobileCardList>
      </div>

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
                <TableHead>Nome</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSafras.map((safra) => (
                <TableRow key={safra.id}>
                  <TableCell className="font-medium text-slate-900">{safra.name}</TableCell>
                  <TableCell className="text-slate-600">
                    {format(new Date(safra.startDate), "dd/MM/yyyy", { locale: ptBR })} — {format(new Date(safra.endDate), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      safra.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 
                      safra.status === 'Planejada' ? 'bg-blue-100 text-blue-800' : 
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {safra.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown 
                      onEdit={() => openEdit(safra)} 
                      onDelete={() => openDelete(safra)} 
                    />
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
        title="Filtrar Safras"
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        filters={[
          { key: 'status', label: 'Status', type: 'select', options: uniqueStatuses as string[] }
        ]}
      />
    </div>
  );
}
