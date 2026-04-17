import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Truck as TruckIcon, Calendar, Tag, Activity,
  Settings, Fuel, Gauge, Navigation, Info, ShieldAlert
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { MOCK_TRUCKS, MOCK_FUEL, MOCK_HARVEST_TRIPS } from "@/src/lib/mock-data";

export function TruckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const truck = MOCK_TRUCKS.find(t => t.id === id);
  // Histórico de abastecimentos deste caminhão
  const truckFuel = MOCK_FUEL.filter(f => f.equipment === truck?.plate).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  // Histórico de viagens (Colheita) deste caminhão
  const truckTrips = MOCK_HARVEST_TRIPS.filter(t => t.truckPlate === truck?.plate).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (!truck) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <TruckIcon className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Caminhão não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/trucks')}>
          Voltar para Caminhões
        </Button>
      </div>
    );
  }

  const totalFrete = truckTrips.reduce((a, t) => a + (t.freightValue || 0), 0);
  const totalPeso = truckTrips.reduce((a, t) => a + t.netWeight, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/admin/trucks')}
          className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{truck.plate}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{truck.driver} · {truck.brand} {truck.model}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Viagens Realizadas</span>
            <Navigation className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{truckTrips.length}</p>
          <p className="text-xs text-slate-400 mt-1">Safra Atual</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Transportado</span>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {(totalPeso / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} <span className="text-sm font-normal text-slate-500">ton</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">{(totalPeso / 60).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} scs</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Custos Combustível</span>
            <Fuel className="h-4 w-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(truckFuel.reduce((a, f) => a + f.cost, 0))}
          </p>
          <p className="text-xs text-slate-400 mt-1">{truckFuel.reduce((a, f) => a + f.liters, 0).toLocaleString('pt-BR')} litros</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Vencimento Seguro</span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-xl font-bold text-slate-900">15/12/2026</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Regularizado</p>
        </div>
      </div>

      {/* Viagens Recentes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-500" />
            Viagens na Colheita
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Talhão</TableHead>
                <TableHead>Destino</TableHead>
                <TableHead className="text-right">Peso Líquido</TableHead>
                <TableHead className="text-right">Frete (R$)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {truckTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="text-sm text-slate-600">
                    {format(new Date(trip.date), "dd/MM/yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="text-sm font-medium">{trip.talhaoName}</TableCell>
                  <TableCell className="text-sm">{trip.destination}</TableCell>
                  <TableCell className="text-right font-bold text-slate-700">
                    {trip.netWeight.toLocaleString('pt-BR')} kg
                  </TableCell>
                  <TableCell className="text-right text-emerald-700 font-medium">
                    {trip.freightValue ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(trip.freightValue) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <button 
                      onClick={() => navigate(`/harvest/${trip.harvestId}`)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Ver Colheita
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {truckTrips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                    Nenhuma viagem registrada para este caminhão.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
