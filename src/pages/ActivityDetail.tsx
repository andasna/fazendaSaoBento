import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Sprout, SprayCan, Wheat, MoreHorizontal,
  Calendar, MapPin, Package, DollarSign, Info
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { MOCK_ACTIVITIES } from "@/src/lib/mock-data";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import type { ActivityType } from "@/src/lib/types";

const TIPO_LABELS: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  plantio: { label: 'Plantio', icon: Sprout, color: 'text-emerald-600 bg-emerald-50' },
  pulverizacao: { label: 'Pulverização', icon: SprayCan, color: 'text-blue-600 bg-blue-50' },
  colheita: { label: 'Colheita', icon: Wheat, color: 'text-amber-600 bg-amber-50' },
  outros: { label: 'Outros', icon: MoreHorizontal, color: 'text-slate-600 bg-slate-100' },
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { talhoes } = useGlobalFilters();

  const activity = MOCK_ACTIVITIES.find(a => a.id === id);

  if (!activity) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Info className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Atividade não encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/activities')}>
          Voltar para Atividades
        </Button>
      </div>
    );
  }

  const tipoInfo = TIPO_LABELS[activity.tipo];
  const TipoIcon = tipoInfo.icon;
  const talhao = talhoes.find(t => t.id === activity.talhaoId);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Mobile Header */}
      <MobileHeader
        title="Detalhes da Atividade"
        subtitle={`${tipoInfo.label} — ${activity.cultura}`}
        onBack={() => navigate('/activities')}
      />
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={() => navigate('/activities')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Detalhes da Atividade</h1>
          <p className="text-sm text-slate-500 mt-0.5">{tipoInfo.label} — {activity.cultura}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <TipoIcon className={`h-4 w-4 ${tipoInfo.color.split(' ')[0]}`} />
            <span className="text-xs font-medium">Tipo</span>
          </div>
          <p className="font-semibold text-slate-900">{tipoInfo.label}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium">Talhão</span>
          </div>
          <p className="font-semibold text-slate-900">{talhao?.name ?? activity.talhaoId}</p>
          <p className="text-xs text-slate-400 mt-0.5">{talhao?.property}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">Data</span>
          </div>
          <p className="font-semibold text-slate-900">
            {format(new Date(activity.date), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <DollarSign className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium">Custo Total</span>
          </div>
          <p className="font-bold text-lg text-red-600">
            {formatBRL(activity.custoTotal)}
          </p>
        </div>
      </div>

      {/* Produtos utilizados */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Package className="h-4 w-4 text-blue-500" />
            Insumos Utilizados
          </h2>
        </div>
        {/* Mobile: cards */}
        <div className="sm:hidden">
          <MobileCardList>
            {activity.produtos.map((p, idx) => (
              <MobileCard
                key={idx}
                title={p.nome}
                subtitle={`${p.quantidade.toLocaleString('pt-BR')} ${p.unidade}`}
                value={formatBRL(p.quantidade * 10)}
                valueColor="default"
                hideChevron
              />
            ))}
            {activity.produtos.length === 0 && (
              <MobileCardEmpty icon={Package} message="Nenhum insumo registrado." />
            )}
          </MobileCardList>
        </div>
        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead className="text-right">Custo Estimado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activity.produtos.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium text-slate-900">{p.nome}</TableCell>
                  <TableCell className="text-right">{p.quantidade.toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="text-slate-600">{p.unidade}</TableCell>
                  <TableCell className="text-right text-slate-500">{formatBRL(p.quantidade * 10)}</TableCell>
                </TableRow>
              ))}
              {activity.produtos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-slate-400">Nenhum insumo registrado.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Observações */}
      {activity.observacao && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400" />
            Observações
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
            {activity.observacao}
          </p>
        </div>
      )}
    </div>
  );
}
