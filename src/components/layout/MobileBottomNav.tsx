import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Wheat, Layers, DollarSign, MoreHorizontal, Fuel, Package, Users, Truck, Tractor } from "lucide-react";
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
  { name: 'Usuários', href: '/admin/users', icon: Users },
];

export function MobileBottomNav() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border sm:hidden flex items-center justify-around h-16 pb-safe">
      {mainTabs.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            {isActive && (
              <div className="absolute top-0 w-8 h-1 bg-primary rounded-b-full"></div>
            )}
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.name}</span>
          </Link>
        );
      })}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl px-4 pb-8 max-h-[92vh]">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-lg">Outros Módulos</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-y-6">
            {secondaryModules.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSheetOpen(false)}
                className="flex flex-col items-center space-y-2"
              >
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-foreground hover:bg-muted/80">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium text-center text-foreground leading-tight">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
