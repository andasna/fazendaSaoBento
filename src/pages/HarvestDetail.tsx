import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft, Plus, Wheat, Truck, User, MapPin, Scale,
  Droplets, AlertTriangle, PackageMinus, DollarSign, Edit2, Trash2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Modal } from "@/src/components/ui/modal";
import { MOCK_HARVESTS, MOCK_HARVEST_TRIPS, MOCK_TRUCKS, MOCK_DRIVERS } from "@/src/lib/mock-data";
import { useGlobalFilters } from "../contexts/GlobalFiltersContext";
import type { HarvestTrip } from "@/src/lib/types";

const formatKg = (kg: number) => `${(kg / 1000).toFixed(2)} t`;
const formatScs = (kg: number) => `${(kg / 60).toFixed(1)} scs`;
const formatPct = (v: number) => `${v.toFixed(1)}%`;
const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const emptyTrip: Omit<HarvestTrip, 'id' | 'harvestId'> = {
  date: new Date().toISOString().slice(0, 16),
  pesoBruto: 0,
  pesoLiquido: 0,
  umidade: 0,
  impureza: 0,
  descontos: 0,
  truckId: '',
  driverId: '',
  destino: '',
  frete: 0,
  origem: '',
};

export function HarvestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { talhoesForSafra } = useGlobalFilters();

  const isNew = id === 'new';

  // ── Estado do resumo ────────────────────────────────────────
  const harvest = isNew ? null : MOCK_HARVESTS.find(h => h.id === id);
  const [trips, setTrips] = useState<HarvestTrip[]>(
    isNew ? [] : MOCK_HARVEST_TRIPS.filter(t => t.harvestId === id)
  );

  // ── Modal de viagem ─────────────────────────────────────────
  const [tripModal, setTripModal] = useState<{ open: boolean; mode: 'new' | 'edit' | 'delete'; trip: HarvestTrip | null }>({
    open: false, mode: 'new', trip: null,
  });
  const [formData, setFormData] = useState<Omit<HarvestTrip, 'id' | 'harvestId'>>(emptyTrip);

  const openNewTrip = () => {
    setFormData({ ...emptyTrip, truckId: harvest?.truckId ?? '', driverId: harvest?.driverId ?? '' });
    setTripModal({ open: true, mode: 'new', trip: null });
  };

  const openEditTrip = (trip: HarvestTrip) => {
    setFormData({
      date: new Date(trip.date).toISOString().slice(0, 16),
      pesoBruto: trip.pesoBruto, pesoLiquido: trip.pesoLiquido,
      umidade: trip.umidade, impureza: trip.impureza, descontos: trip.descontos,
      truckId: trip.truckId, driverId: trip.driverId,
      destino: trip.destino, frete: trip.frete, origem: trip.origem,
    });
    setTripModal({ open: true, mode: 'edit', trip });
  };

  const openDeleteTrip = (trip: HarvestTrip) => {
    setTripModal({ open: true, mode: 'delete', trip });
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (tripModal.mode === 'new') {
      const novo: HarvestTrip = {
        id: Date.now().toString(),
        harvestId: id ?? 'new',
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      setTrips(prev => [...prev, novo]);
    } else if (tripModal.mode === 'edit' && tripModal.trip) {
      setTrips(prev =>
        prev.map(t => t.id === tripModal.trip!.id
          ? { ...t, ...formData, date: new Date(formData.date).toISOString() }
          : t
        )
      );
    }
    setTripModal({ open: false, mode: 'new', trip: null });
  };

  const confirmDeleteTrip = () => {
    setTrips(prev => prev.filter(t => t.id !== tripModal.trip?.id));
    setTripModal({ open: false, mode: 'new', trip: null });
  };

  // ── Totais das viagens ──────────────────────────────────────
  const totalPesoBruto = trips.reduce((a, t) => a + t.pesoBruto, 0);
  const totalPesoLiquido = trips.reduce((a, t) => a + t.pesoLiquido, 0);
  const totalDescontos = trips.reduce((a, t) => a + t.descontos, 0);
  const totalFrete = trips.reduce((a, t) => a + t.frete, 0);
  const avgUmidade = trips.length ? trips.reduce((a, t) => a + t.umidade, 0) / trips.length : 0;
  const avgImpureza = trips.length ? trips.reduce((a, t) => a + t.impureza, 0) / trips.length : 0;

  if (!isNew && !harvest) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Wheat className="h-12 w-12 mb-4" />
        <p className="text-lg font-medium">Registro não encontrado</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/harvest')}>
          Voltar para Colheita
        </Button>
      </div>
    );
  }

  const driver = harvest ? MOCK_DRIVERS.find(d => d.id === harvest.driverId) : null;
  const truck = harvest ? MOCK_TRUCKS.find(t => t.id === harvest.truckId) : null;
  const talhao = harvest ? talhoesForSafra.find(t => t.id === harvest.talhaoId) : null;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/harvest')}
            className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isNew ? 'Nova Colheita' : `Detalhes — ${harvest?.cultura}`}
            </h1>
            {!isNew && harvest && (
              <p className="text-sm text-slate-500 mt-0.5">
                {format(new Date(harvest.date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            )}
          </div>
        </div>
        {!isNew && (
          <button
            onClick={openNewTrip}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Viagem
          </button>
        )}
      </div>

      {/* Info do resumo */}
      {!isNew && harvest && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Wheat className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium">Cultura</span>
            </div>
            <p className="font-semibold text-slate-900">{harvest.cultura}</p>
            {talhao && <p className="text-xs text-slate-400 mt-0.5">Talhão {talhao.name} · {talhao.area} ha</p>}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Truck className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium">Caminhão</span>
            </div>
            <p className="font-semibold font-mono text-slate-900">{truck?.plate ?? '-'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{truck?.model}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <User className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium">Motorista</span>
            </div>
            <p className="font-semibold text-slate-900">{driver?.name ?? '-'}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
              <Scale className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium">Área Colhida</span>
            </div>
            <p className="font-semibold text-slate-900">{harvest.area} ha</p>
          </div>
        </div>
      )}

      {/* Totais agregados das viagens */}
      {!isNew && trips.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-900 mb-4">Resumo das Viagens</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <p className="text-xs text-slate-500">Peso Bruto (entrada)</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{formatKg(totalPesoBruto)}</p>
              <p className="text-xs text-slate-400">{formatScs(totalPesoBruto)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Peso Líquido (saída)</p>
              <p className="text-base font-bold text-emerald-700 mt-0.5">{formatKg(totalPesoLiquido)}</p>
              <p className="text-xs text-slate-400">{formatScs(totalPesoLiquido)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Descontos</p>
              <p className="text-base font-bold text-red-600 mt-0.5">{formatKg(totalDescontos)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Umidade média</p>
              <p className="text-base font-bold text-blue-700 mt-0.5">{formatPct(avgUmidade)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Impureza média</p>
              <p className="text-base font-bold text-amber-700 mt-0.5">{formatPct(avgImpureza)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Frete Total</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">{formatBRL(totalFrete)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de viagens */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">
            Viagens Registradas
            {trips.length > 0 && (
              <span className="ml-2 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {trips.length} {trips.length === 1 ? 'viagem' : 'viagens'}
              </span>
            )}
          </h2>
          {!isNew && (
            <button
              onClick={openNewTrip}
              className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-medium"
            >
              <Plus className="h-4 w-4 mr-1" /> Nova Viagem
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Origem → Destino</TableHead>
                <TableHead className="text-right">Peso Bruto</TableHead>
                <TableHead className="text-right">Peso Líquido</TableHead>
                <TableHead className="text-right">Umidade</TableHead>
                <TableHead className="text-right">Impureza</TableHead>
                <TableHead className="text-right">Descontos</TableHead>
                <TableHead>Caminhão</TableHead>
                <TableHead>Motorista</TableHead>
                <TableHead className="text-right">Frete</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trips.map((trip) => {
                const td = MOCK_DRIVERS.find(d => d.id === trip.driverId);
                const tt = MOCK_TRUCKS.find(t => t.id === trip.truckId);
                return (
                  <TableRow key={trip.id}>
                    <TableCell className="whitespace-nowrap text-slate-600">
                      {format(new Date(trip.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="text-slate-700">{trip.origem}</span>
                        <span className="text-slate-400">↓</span>
                        <span className="text-slate-500">{trip.destino}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatKg(trip.pesoBruto)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-700">{formatKg(trip.pesoLiquido)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`text-xs font-medium ${trip.umidade > 14 ? 'text-amber-600' : 'text-slate-600'}`}>
                        {formatPct(trip.umidade)}
                        {trip.umidade > 14 && <AlertTriangle className="inline h-3 w-3 ml-0.5" />}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600">{formatPct(trip.impureza)}</TableCell>
                    <TableCell className="text-right text-red-600 text-sm">{formatKg(trip.descontos)}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {tt?.plate ?? '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{td?.name ?? '-'}</TableCell>
                    <TableCell className="text-right text-sm">{formatBRL(trip.frete)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditTrip(trip)}
                          className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteTrip(trip)}
                          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600"
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {trips.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12 text-slate-400">
                    <Scale className="h-8 w-8 mx-auto mb-2 text-slate-200" />
                    <p>Nenhuma viagem registrada.</p>
                    <button
                      onClick={openNewTrip}
                      className="mt-3 text-sm text-emerald-600 hover:underline"
                    >
                      + Registrar primeira viagem
                    </button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal de viagem */}
      <Modal
        isOpen={tripModal.open}
        onClose={() => setTripModal(prev => ({ ...prev, open: false }))}
        title={
          tripModal.mode === 'new' ? 'Registrar Viagem' :
          tripModal.mode === 'edit' ? 'Editar Viagem' : 'Excluir Viagem'
        }
      >
        {tripModal.mode === 'delete' && (
          <div className="space-y-4">
            <p className="text-slate-700">Tem certeza que deseja excluir esta viagem?</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setTripModal(prev => ({ ...prev, open: false }))}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteTrip}>Excluir</Button>
            </div>
          </div>
        )}

        {(tripModal.mode === 'new' || tripModal.mode === 'edit') && (
          <form onSubmit={handleSaveTrip} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Data e Hora</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.date}
                  onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peso Bruto (kg)</label>
                <input type="number" required min="0" value={formData.pesoBruto || ''}
                  onChange={e => setFormData(p => ({ ...p, pesoBruto: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peso Líquido (kg)</label>
                <input type="number" required min="0" value={formData.pesoLiquido || ''}
                  onChange={e => setFormData(p => ({ ...p, pesoLiquido: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Umidade (%)</label>
                <input type="number" step="0.1" min="0" max="100" value={formData.umidade || ''}
                  onChange={e => setFormData(p => ({ ...p, umidade: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Impureza (%)</label>
                <input type="number" step="0.1" min="0" max="100" value={formData.impureza || ''}
                  onChange={e => setFormData(p => ({ ...p, impureza: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descontos (kg)</label>
                <input type="number" min="0" value={formData.descontos || ''}
                  onChange={e => setFormData(p => ({ ...p, descontos: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Frete (R$)</label>
                <input type="number" step="0.01" min="0" value={formData.frete || ''}
                  onChange={e => setFormData(p => ({ ...p, frete: +e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Caminhão</label>
                <select value={formData.truckId}
                  onChange={e => setFormData(p => ({ ...p, truckId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Selecione...</option>
                  {MOCK_TRUCKS.map(t => (
                    <option key={t.id} value={t.id}>{t.plate} — {t.model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Motorista</label>
                <select value={formData.driverId}
                  onChange={e => setFormData(p => ({ ...p, driverId: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="">Selecione...</option>
                  {MOCK_DRIVERS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Origem</label>
                <input type="text" required value={formData.origem}
                  onChange={e => setFormData(p => ({ ...p, origem: e.target.value }))}
                  placeholder="Ex: Fazenda São Bento (A1)"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Destino (silo/armazém)</label>
                <input type="text" required value={formData.destino}
                  onChange={e => setFormData(p => ({ ...p, destino: e.target.value }))}
                  placeholder="Ex: Silo Central, Porto de Paranaguá"
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setTripModal(prev => ({ ...prev, open: false }))}>
                Cancelar
              </Button>
              <Button type="submit">Salvar Viagem</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
