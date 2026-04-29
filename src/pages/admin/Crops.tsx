import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Plus, Search, Filter, Download, Sprout } from "lucide-react";
import { ActionDropdown } from "@/src/components/ui/action-dropdown";
import { MOCK_CROPS } from "@/src/lib/mock-data";
import { FilterDrawer } from "@/src/components/ui/filter-drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/src/components/ui/sheet";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";

export function Crops() {
  const [crops, setCrops] = useState(MOCK_CROPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'new' | 'edit' | 'delete'>('new');
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Ativa' });

  // Filter state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilterValues({});
  };

  const filteredCrops = crops.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = c.name.toLowerCase().includes(term) ||
                          c.description.toLowerCase().includes(term);
    const matchesStatus = !filterValues.status || c.status === filterValues.status;
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = Array.from(new Set(crops.map(c => c.status)));

  const openNew = () => {
    setModalMode('new');
    setFormData({ name: '', description: '', status: 'Ativa' });
    setIsModalOpen(true);
  };

  const openEdit = (crop: any) => {
    setModalMode('edit');
    setSelectedCrop(crop);
    setFormData({ 
      name: crop.name, 
      description: crop.description, 
      status: crop.status 
    });
    setIsModalOpen(true);
  };

  const openDelete = (crop: any) => {
    setModalMode('delete');
    setSelectedCrop(crop);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setCrops(crops.filter(c => c.id !== selectedCrop.id));
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'new') {
      setCrops([...crops, { id: Date.now().toString(), ...formData }]);
    } else if (modalMode === 'edit') {
      setCrops(crops.map(c => c.id === selectedCrop.id ? { ...c, ...formData } : c));
    }
    setIsModalOpen(false);
  };

  const CropForm = () => (
    <div className="space-y-4 pb-4">
      {modalMode === 'delete' ? (
        <div className="space-y-4">
          <p className="text-slate-700">Tem certeza que deseja excluir a cultura <strong>{selectedCrop?.name}</strong>?</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} className="flex-1">Excluir</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nome</label>
            <input 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              placeholder="Ex: Soja"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Descrição</label>
            <textarea 
              required 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30" 
              placeholder="Ex: Soja convencional..."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Status</label>
            <select 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
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
            <Sprout className="h-6 w-6 text-emerald-600" />
            Gestão de Culturas
          </h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie as culturas plantadas na fazenda.</p>
        </div>
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetTrigger asChild>
            <button onClick={openNew} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />Nova Cultura
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto px-5 pt-4">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <SheetHeader className="mb-4">
              <SheetTitle>
                {modalMode === 'new' ? 'Nova Cultura' : modalMode === 'edit' ? 'Editar Cultura' : 'Excluir Cultura'}
              </SheetTitle>
            </SheetHeader>
            <CropForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar cultura..."
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
                {modalMode === 'new' ? 'Nova Cultura' : modalMode === 'edit' ? 'Editar Cultura' : 'Excluir Cultura'}
              </SheetTitle>
            </SheetHeader>
            <CropForm />
          </SheetContent>
        </Sheet>
      </div>

      <div className="sm:hidden">
        <MobileCardList>
          {filteredCrops.map(c => (
            <MobileCard
              key={c.id}
              title={c.name}
              subtitle={c.description}
              badge={{ 
                label: c.status, 
                variant: c.status === 'Ativa' ? 'emerald' : 'slate' 
              }}
              hideChevron
              actions={
                <ActionDropdown 
                  onEdit={() => openEdit(c)}
                  onDelete={() => openDelete(c)}
                />
              }
            />
          ))}
          {filteredCrops.length === 0 && <MobileCardEmpty icon={Sprout} message="Nenhuma cultura encontrada." />}
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrops.map((crop) => (
                <TableRow key={crop.id}>
                  <TableCell className="font-medium text-slate-900">{crop.name}</TableCell>
                  <TableCell className="text-slate-600">{crop.description}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      crop.status === 'Ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {crop.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown 
                      onEdit={() => openEdit(crop)} 
                      onDelete={() => openDelete(crop)} 
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
        title="Filtrar Culturas"
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
