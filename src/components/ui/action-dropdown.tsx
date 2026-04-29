import * as React from "react";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface ActionDropdownProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionDropdown({ onEdit, onDelete }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button 
        onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        className="p-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg border border-slate-200 z-10 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" /> Editar
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Excluir
          </button>
        </div>
      )}
    </div>
  );
}
