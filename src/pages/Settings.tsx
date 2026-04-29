import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle2, Sliders, ChevronRight } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="hidden sm:block">
        <h2 className="text-2xl font-bold text-slate-900">Configurações e Importação</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie a importação de planilhas e configurações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="p-5 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              Importar Planilhas (MVP)
            </CardTitle>
            <CardDescription className="text-xs">
              Popule o sistema via Excel.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="border-2 border-dashed border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all cursor-pointer bg-slate-50/30 active:scale-[0.98]">
              <Upload className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Clique para enviar</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium tracking-tight">ou arraste arquivos .xlsx</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Arquivos Suportados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Caminhões', 'Colheita', 'Movimentação', 'Diesel'].map(file => (
                  <div key={file} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-xs font-medium text-slate-600 truncate">{file}.xlsx</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-200">
          <CardHeader className="p-5 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sliders className="h-5 w-5 text-emerald-600" />
              Preferências
            </CardTitle>
            <CardDescription className="text-xs">
              Configure alertas e modos de uso.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 pb-1">
            <div className="space-y-2">
              {[
                { title: 'Modo Mobile', desc: 'Interface simplificada para motoristas', action: 'Configurar' },
                { title: 'Alertas Diesel', desc: 'Notificar consumo excessivo (>20%)', action: 'Editar' },
                { title: 'Relatórios', desc: 'Envio semanal automático por e-mail', action: 'Ativar' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:border-emerald-100 transition-colors cursor-pointer group">
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              ))}
            </div>
          </CardContent>
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 mt-4">
            <Button variant="outline" className="w-full text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-bold uppercase tracking-widest">
              Sair da Conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
