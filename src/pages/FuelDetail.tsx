import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Droplets, Calendar, User, Truck,
  DollarSign, Info, Activity, Clock, Gauge
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { MOCK_FUEL } from "@/src/lib/mock-data";

export function FuelDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fuel = MOCK_FUEL.find(f => f.id === id);

  if (!fuel) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Droplets className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Registro de abastecimento não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/fuel')}>
          Voltar para Diesel
        </Button>
      </div>
    );
  }

  // Simulação de dados adicionais que estariam no banco
  const avgConsumption = 15.5; // L/h ou L/km mock

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Mobile Header */}
      <MobileHeader
        title="Abastecimento"
        subtitle={`${fuel.equipment} · ${format(new Date(fuel.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}`}
        onBack={() => navigate('/fuel')}
      />
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={() => navigate('/fuel')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Detalhes do Abastecimento</h1>
          <p className="text-sm text-slate-500 mt-0.5">{fuel.equipment} · {format(new Date(fuel.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Volume</span>
            <Droplets className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {fuel.liters.toLocaleString('pt-BR')} <span className="text-sm font-normal text-slate-500">Litros</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Custo Total</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fuel.cost)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fuel.cost / fuel.liters)} / litro
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Equipamento</span>
            <Truck className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{fuel.equipment}</p>
          <p className="text-xs text-slate-400 mt-1">Placa/ID: {fuel.equipment.split(' ')[1] || 'FSB-001'}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Operador</span>
            <User className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">{fuel.employee}</p>
        </div>
      </div>

      {/* Dados Operacionais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-400" />
            Dados da Máquina no Ato
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">Horímetro / Odômetro</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 text-right">1.245,8 h</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">Consumo Médio Estimado</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 text-right">{avgConsumption} L/h</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-400" />
            Informações Adicionais
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-600">Local do Abastecimento</span>
              <span className="text-sm font-semibold text-slate-900 text-right">Tanque Principal (Sede)</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-sm text-slate-600">Responsável pela Bomba</span>
              <span className="text-sm font-semibold text-slate-900 text-right">Almoxarifado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
