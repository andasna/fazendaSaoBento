import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, DollarSign, CreditCard, Calendar,
  Building2, FileText, Tag, Banknote
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { MOCK_FINANCIAL } from "@/src/lib/mock-data";
import type { FinancialType } from "@/src/lib/types";

const TIPO_LABELS: Record<FinancialType, string> = {
  maquina: 'Máquina',
  estoque: 'Estoque/Insumos',
  colheita: 'Colheita',
  administrativo: 'Administrativo',
  diesel: 'Diesel/Combustível',
  outros: 'Outros',
};

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

export function FinancialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const record = MOCK_FINANCIAL.find(r => r.id === id);
  const parcelas = record
    ? MOCK_FINANCIAL.filter(r => r.parcelamentoGroupId === record.parcelamentoGroupId)
        .sort((a, b) => a.parcela - b.parcela)
    : [];

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <DollarSign className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Registro não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/financial')}>
          Voltar para Financeiro
        </Button>
      </div>
    );
  }

  const totalGrupo = parcelas.reduce((a, r) => a + r.valor, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Mobile Header */}
      <MobileHeader
        title="Detalhes Financeiro"
        subtitle={record.descricao}
        onBack={() => navigate('/financial')}
      />
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={() => navigate('/financial')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Detalhes Financeiro</h1>
          <p className="text-sm text-slate-500 mt-0.5">{record.descricao}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium">Fornecedor</span>
          </div>
          <p className="font-semibold text-slate-900">{record.fornecedor}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Tag className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium">Tipo</span>
          </div>
          <p className="font-semibold text-slate-900">{TIPO_LABELS[record.tipo]}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Banknote className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium">Valor Total</span>
          </div>
          <p className={`font-bold text-lg ${record.categoria === 'receita' ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatBRL(totalGrupo)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium">Data</span>
          </div>
          <p className="font-semibold text-slate-900">
            {format(new Date(record.date), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      {/* Detalhes adicionais */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900 mb-4">Informações do Registro</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Categoria</span>
            <span className={`font-medium ${record.categoria === 'receita' ? 'text-emerald-700' : 'text-red-600'}`}>
              {record.categoria === 'receita' ? 'Receita' : 'Despesa'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Banco</span>
            <span className="font-medium text-slate-900">{record.banco}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Status</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              record.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {record.status === 'pago' ? 'Pago' : 'Em Aberto'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500">Vencimento</span>
            <span className="font-medium text-slate-900">
              {format(new Date(record.vencimento), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
      </div>

      {/* Parcelas (se houver mais de 1) */}
      {parcelas.length > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              Parcelamento — {parcelas.length}x de {formatBRL(parcelas[0].valor)}
            </h2>
          </div>
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-500" />
              Parcelamento — {parcelas.length}x de {formatBRL(parcelas[0].valor)}
            </h2>
          </div>
          {/* Mobile: cards */}
          <div className="sm:hidden">
            <MobileCardList>
              {parcelas.map(p => (
                <MobileCard
                  key={p.id}
                  className={p.id === record.id ? 'bg-blue-50' : ''}
                  title={`${p.parcela}/${p.totalParcelas} — ${format(new Date(p.vencimento), "dd/MM/yyyy", { locale: ptBR })}`}
                  subtitle={p.status === 'pago' ? 'Pago' : 'Aberto'}
                  badge={{ label: p.status === 'pago' ? 'Pago' : 'Aberto', variant: p.status === 'pago' ? 'emerald' : 'amber' }}
                  value={formatBRL(p.valor)}
                  valueColor="default"
                  onClick={() => navigate(`/financial/${p.id}`)}
                />
              ))}
            </MobileCardList>
          </div>
          {/* Desktop: items */}
          <div className="hidden sm:block divide-y divide-slate-100">
            {parcelas.map(p => (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  p.id === record.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {p.parcela}/{p.totalParcelas}
                  </span>
                  <span className="text-slate-600">
                    Vence em {format(new Date(p.vencimento), "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-slate-900">{formatBRL(p.valor)}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    p.status === 'pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {p.status === 'pago' ? 'Pago' : 'Aberto'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
