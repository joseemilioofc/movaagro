import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

interface ExportExcelButtonProps {
  logs: AuditLog[];
  getUserName: (userId: string) => string;
}

export const ExportExcelButton = ({ logs, getUserName }: ExportExcelButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      create: "Criação",
      update: "Atualização",
      delete: "Exclusão",
      login: "Login",
      logout: "Logout",
      email_sent: "Email Enviado",
    };
    return labels[action] || action;
  };

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      user: "Usuário",
      transport_request: "Pedido",
      transport_proposal: "Proposta",
      profile: "Perfil",
    };
    return labels[entityType] || entityType;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const data = logs.map((log) => ({
        "Data/Hora": new Date(log.created_at).toLocaleString("pt-BR"),
        "Usuário": getUserName(log.user_id),
        "Ação": getActionLabel(log.action),
        "Entidade": getEntityLabel(log.entity_type),
        "ID da Entidade": log.entity_id || "-",
        "Endereço IP": log.ip_address || "-",
        "Detalhes": log.details ? JSON.stringify(log.details) : "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Auditoria");

      // Auto-size columns
      const columnWidths = [
        { wch: 20 }, // Data/Hora
        { wch: 25 }, // Usuário
        { wch: 15 }, // Ação
        { wch: 15 }, // Entidade
        { wch: 40 }, // ID da Entidade
        { wch: 15 }, // Endereço IP
        { wch: 50 }, // Detalhes
      ];
      worksheet["!cols"] = columnWidths;

      const fileName = `auditoria_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={handleExport} disabled={isExporting || logs.length === 0} variant="outline">
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileSpreadsheet className="w-4 h-4 mr-2" />
      )}
      Exportar Excel
    </Button>
  );
};
