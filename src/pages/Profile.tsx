import React from 'react';
import { Activity, Tractor, Truck, Fuel } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'fuel', description: 'Abasteceu Trator John Deere (200L)', date: '2026-03-26 10:30', icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-100' },
  { id: 2, type: 'harvest', description: 'Operou Colheitadeira no Talhão A1', date: '2026-03-25 14:00', icon: Tractor, color: 'text-emerald-500', bg: 'bg-emerald-100' },
  { id: 3, type: 'freight', description: 'Transporte de Soja para Silo Central', date: '2026-03-24 09:15', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-100' },
];

export function Profile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-emerald-600"></div>
        <div className="px-6 pb-6">
          <div className="relative flex items-end -mt-12 mb-4">
            <div className="h-24 w-24 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-emerald-700 text-3xl font-bold">
              U
            </div>
            <div className="ml-4 pb-2">
              <h1 className="text-2xl font-bold text-slate-900">Usuário Logado</h1>
              <p className="text-slate-500">Operador de Máquinas</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Abastecimentos Realizados</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">45</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Horas de Colheita</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">120h</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500 font-medium">Viagens de Transporte</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-600" />
            Histórico de Atividades Recentes
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`mt-1 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
