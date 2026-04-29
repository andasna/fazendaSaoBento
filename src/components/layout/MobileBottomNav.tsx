import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wheat, Layers, DollarSign, MoreHorizontal, Fuel, Package, Users, Truck, Tractor, Settings, CalendarDays, Map, Sprout } from "lucide-react";
import { cn } from "../../lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

const mainTabs = [
  { name: 'Início', href: '/', icon: LayoutDashboard },
  { name: 'Colheita', href: '/harvest', icon: Wheat },
  { name: 'Atividades', href: '/activities', icon: Layers },
  { name: 'Financeiro', href: '/financial', icon: DollarSign },
];

const secondaryModules = [
  { name: 'Diesel', href: '/fuel', icon: Fuel },
  { name: 'Estoque', href: '/stock', icon: Package },
  { name: 'Máquinas', href: '/admin/machines', icon: Tractor },
  { name: 'Caminhões', href: '/admin/trucks', icon: Truck },
  { name: 'Safras', href: '/admin/safras', icon: CalendarDays },
  { name: 'Talhões', href: '/admin/talhoes', icon: Map },
  { name: 'Culturas', href: '/admin/crops', icon: Sprout },
  { name: 'Usuários', href: '/admin/users', icon: Users },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const isActiveTab = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const isSecondaryActive = secondaryModules.some(m =>
    location.pathname === m.href || location.pathname.startsWith(m.href + '/')
  );

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Barra de navegação */}
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center h-16 px-1">
        {mainTabs.map((item) => {
          const isActive = isActiveTab(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 relative transition-all active:scale-95",
                isActive ? "text-emerald-700" : "text-slate-400"
              )}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-emerald-600" : "")} />
              <span className="text-[10px] font-semibold leading-none">{item.name}</span>
            </Link>
          );
        })}

        {/* Botão "Mais" */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-95 relative",
                isSecondaryActive ? "text-emerald-700" : "text-slate-400"
              )}
            >
              {isSecondaryActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
              )}
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-semibold leading-none">Mais</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-3xl px-5 pb-8 max-h-[85vh]"
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 mt-1" />
            <SheetHeader className="text-left mb-5">
              <SheetTitle className="text-base font-bold text-slate-900">Outros Módulos</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-4 gap-x-2 gap-y-5">
              {secondaryModules.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSheetOpen(false)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-95",
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-center text-slate-600 leading-tight">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
