import React from 'react';
import { Activity, Tractor, Truck, Fuel, Shield, Mail, MapPin } from 'lucide-react';
import { MobileCard, MobileCardList } from "../components/ui/mobile-card";

const mockActivities = [
  { id: 1, type: 'fuel', description: 'Abasteceu Trator John Deere (200L)', date: '2026-03-26 10:30', icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 2, type: 'harvest', description: 'Operou Colheitadeira no Talhão A1', date: '2026-03-25 14:00', icon: Tractor, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 3, type: 'freight', description: 'Transporte de Soja para Silo Central', date: '2026-03-24 09:15', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100' },
];

export function Profile() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-28 sm:h-32 bg-emerald-600"></div>
        <div className="px-5 sm:px-6 pb-6">
          <div className="relative flex items-end -mt-10 sm:-mt-12 mb-4">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-100 border-[3px] border-white flex items-center justify-center text-emerald-700 text-2xl sm:text-3xl font-bold shadow-sm">
              A
            </div>
            <div className="ml-4 pb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">André Thomé</h1>
              <p className="text-sm font-medium text-slate-500">Administrador</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Abastecimentos</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">45</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Horas de Colheita</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">120h</p>
            </div>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">Viagens</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Informações Pessoais
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">E-mail</p>
                <p className="text-sm font-medium text-slate-700">andre@fazendasb.com.br</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                <MapPin className="h-4 w-4 text-slate-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Localização</p>
                <p className="text-sm font-medium text-slate-700">Sede Principal — Fazenda São Bento</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" />
              Atividades Recentes
            </h2>
          </div>
          <div className="sm:p-2">
             <MobileCardList>
                {mockActivities.map((activity) => (
                   <MobileCard
                      key={activity.id}
                      title={activity.description}
                      subtitle={activity.date}
                      icon={activity.icon}
                      iconColor={activity.color}
                      hideChevron
                   />
                ))}
             </MobileCardList>
          </div>
        </div>
      </div>
    </div>
  );
}
