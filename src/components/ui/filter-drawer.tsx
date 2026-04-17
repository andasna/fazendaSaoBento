import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Button } from './button';

interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text';
  options?: string[];
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  filters: FilterOption[];
  filterValues: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function FilterDrawer({
  isOpen,
  onClose,
  title = 'Filtros',
  filters,
  filterValues,
  onFilterChange,
  onClearFilters
}: FilterDrawerProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {filters.map(filter => (
            <div key={filter.key} className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                {filter.label}
              </label>
              {filter.type === 'select' ? (
                <select
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="">Todos</option>
                  {filter.options?.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filterValues[filter.key] || ''}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  placeholder={`Filtrar por ${filter.label.toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              onClearFilters();
              onClose();
            }}
          >
            Limpar
          </Button>
          <Button 
            className="flex-1"
            onClick={onClose}
          >
            Aplicar
          </Button>
        </div>
      </div>
    </>
  );
}
