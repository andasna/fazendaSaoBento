import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Settings, Calendar, Tag, Activity,
  Clock, Fuel, Navigation, Info, ShieldAlert, Wrench
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MobileHeader } from "@/src/components/layout/MobileHeader";
import { MobileCard, MobileCardList, MobileCardEmpty } from "@/src/components/ui/mobile-card";
import { MOCK_MACHINES, MOCK_FUEL, MOCK_ACTIVITIES } from "@/src/lib/mock-data";

export function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const machine = MOCK_MACHINES.find(m => m.id === id);
  const machineFuel = MOCK_FUEL.filter(f => f.equipment === machine?.name).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const machineActivities = MOCK_ACTIVITIES.filter(a => a.observacao?.includes(machine?.name ?? '___'));

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Activity className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Máquina não encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/machines')}>
          Voltar para Máquinas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Mobile Header */}
      <MobileHeader
        title={machine.name}
        subtitle={`${machine.brand} · ${machine.type}`}
        onBack={() => navigate('/admin/machines')}
      />
      {/* Desktop Header */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/machines')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{machine.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{machine.brand} · {machine.type}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
            <div className={`h-2 w-2 rounded-full ${machine.status === 'Ativa' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          </div>
          <p className="text-xl font-bold text-slate-900">{machine.status}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Horímetro</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">1.245,8 <span className="text-sm font-normal text-slate-500">h</span></p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Último Abastecimento</span>
            <Fuel className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">
            {machineFuel[0]?.liters.toLocaleString('pt-BR') || '0'} <span className="text-sm font-normal text-slate-500">L</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">
            {machineFuel[0] ? format(new Date(machineFuel[0].date), "dd/MM/yyyy", { locale: ptBR }) : '—'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Próx. Manutenção</span>
            <Wrench className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 underline decoration-dotted cursor-help" title="Alerta em 54h">1.300 h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Histórico de Manutenções */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Wrench className="h-4 w-4 text-orange-500" />
              Histórico de Manutenções
            </h2>
          </div>
          {/* Mobile: cards */}
          <div className="sm:hidden">
            <MobileCardList>
              {machineActivities.map((act) => (
                <MobileCard
                  key={act.id}
                  title={act.tipo === 'outros' ? 'Manutenção' : act.tipo.charAt(0).toUpperCase() + act.tipo.slice(1)}
                  subtitle={`${format(new Date(act.date), "dd/MM/yyyy", { locale: ptBR })} · ${act.cultura}`}
                  detail="Oficina Central"
                  badge={{ label: 'Concluída', variant: 'emerald' }}
                  value="R$ 1.250"
                  valueColor="default"
                  onClick={() => navigate(`/activities/${act.id}`)}
                />
              ))}
              {machineActivities.length === 0 && (
                <MobileCardEmpty icon={Wrench} message="Nenhuma manutenção encontrada." />
              )}
            </MobileCardList>
          </div>
          {/* Desktop: table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Local / Empresa</TableHead>
                  <TableHead className="text-right">Horímetro</TableHead>
                  <TableHead className="text-right">Custo (R$)</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineActivities.map((act) => (
                  <TableRow key={act.id}>
                    <TableCell className="text-sm text-slate-600">
                      {format(new Date(act.date), "dd/MM/yyyy", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {act.tipo === 'outros' ? 'Manutenção' : act.tipo.charAt(0).toUpperCase() + act.tipo.slice(1)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">Oficina Central</TableCell>
                    <TableCell className="text-right font-semibold text-slate-700">{act.cultura}</TableCell>
                    <TableCell className="text-right text-red-600 font-medium">R$ 1.250</TableCell>
                    <TableCell className="text-right">
                      <button 
                        onClick={() => navigate(`/activities/${act.id}`)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {machineActivities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                      Nenhuma manutenção registrada para este equipamento.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Especificações Técnicas */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-slate-400" />
            Detalhes Técnicos
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Marca/Modelo</span>
              <span className="font-medium">John Deere 7J</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Ano</span>
              <span className="font-medium">2021</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Chassi</span>
              <span className="font-mono text-xs">JDE7-9823-XYZ</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Capacidade Tanque</span>
              <span className="font-medium">350 L</span>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase">Observações</h3>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                Utilizada prioritariamente para plantio e preparo de solo no Talhão A1.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
