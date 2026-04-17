import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Tractor, Calendar, Tag, Activity,
  Settings, Fuel, Gauge, Clock, Info, Hammer
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MOCK_MACHINES, MOCK_FUEL } from "@/src/lib/mock-data";

export function MachineDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const machine = MOCK_MACHINES.find(m => m.id === id);
  // Histórico de abastecimentos desta máquina
  const machineFuel = MOCK_FUEL.filter(f => f.equipment === machine?.name).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Tractor className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Máquina não encontrada</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/machines')}>
          Voltar para Máquinas
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/machines')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{machine.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{machine.type} · ID: {machine.id}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
            <div className={`h-2 w-2 rounded-full ${machine.status === 'Ativo' ? 'bg-emerald-500' : 'bg-red-500'}`} />
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
            <Hammer className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="text-xl font-bold text-slate-900 underline decoration-dotted cursor-help" title="Alerta em 54h">1.300 h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Histórico de Abastecimentos */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Fuel className="h-4 w-4 text-orange-500" />
              Histórico de Abastecimentos
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Operador</TableHead>
                  <TableHead className="text-right">Litros</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machineFuel.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="text-sm text-slate-600">
                      {format(new Date(f.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-sm">{f.employee}</TableCell>
                    <TableCell className="text-right font-bold text-orange-600">
                      {f.liters.toLocaleString('pt-BR')} L
                    </TableCell>
                    <TableCell className="text-right">
                      <button 
                        onClick={() => navigate(`/fuel/${f.id}`)}
                        className="text-xs text-emerald-600 hover:underline"
                      >
                        Ver registro
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
                {machineFuel.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 italic">
                      Nenhum abastecimento registrado para esta máquina.
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
