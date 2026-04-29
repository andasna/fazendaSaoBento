import React from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "../../lib/utils";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  /** Slot direito — ex: botão de editar ou ações */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * MobileHeader — header padronizado para telas de detalhe no mobile.
 * Visível apenas em mobile (sm:hidden). No desktop o Layout padrão já provê o header.
 */
export function MobileHeader({ title, subtitle, onBack, actions, className }: MobileHeaderProps) {
  return (
    <div
      className={cn(
        "sm:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3",
        "bg-white/90 backdrop-blur-md border-b border-slate-100/80",
        className
      )}
    >
      {/* Botão voltar — hitbox ≥44px */}
      <button
        onClick={onBack}
        className="flex items-center justify-center w-11 h-11 -ml-2 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 active:bg-emerald-100 transition-all"
        aria-label="Voltar"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {/* Título */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold font-display text-slate-900 truncate leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Slot de ações direita */}
      {actions && (
        <div className="flex items-center gap-1 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
