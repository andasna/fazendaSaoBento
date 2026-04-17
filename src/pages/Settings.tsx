import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configurações e Importação</h2>
        <p className="mt-1 text-sm text-slate-500">
          Gerencie a importação de planilhas e configurações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
              Importar Planilhas (MVP)
            </CardTitle>
            <CardDescription>
              Faça upload das suas planilhas de Excel para popular o sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-slate-400 mb-3" />
              <p className="text-sm font-medium text-slate-900">Clique para fazer upload</p>
              <p className="text-xs text-slate-500 mt-1">ou arraste e solte seus arquivos .xlsx aqui</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-900">Planilhas Suportadas:</h4>
              <ul className="text-sm text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Caminhões.xlsx
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Colheita.xlsx
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Movimentacao.xlsx
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Diesel.xlsx
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Gerais</CardTitle>
            <CardDescription>
              Preferências do sistema e usuários.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Modo Mobile</h4>
                  <p className="text-xs text-slate-500">Habilitar interface simplificada para motoristas</p>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Alertas de Combustível</h4>
                  <p className="text-xs text-slate-500">Notificar quando consumo exceder 20% da média</p>
                </div>
                <Button variant="outline" size="sm">Editar</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-slate-900">Exportação Automática</h4>
                  <p className="text-xs text-slate-500">Enviar relatórios semanais por e-mail</p>
                </div>
                <Button variant="outline" size="sm">Ativar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
