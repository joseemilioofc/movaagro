import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface ExportAuditPDFButtonProps {
  logs: AuditLog[];
  getUserName: (userId: string) => string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

const actionLabels: Record<string, string> = {
  create: "Criação",
  update: "Atualização",
  delete: "Exclusão",
  login: "Login",
  logout: "Logout",
  email_sent: "Email Enviado",
  view: "Visualização",
  accept: "Aceito",
  reject: "Rejeitado",
  sign_contract: "Contrato Assinado",
  send_message: "Mensagem",
  submit_proposal: "Proposta",
  complete_transport: "Transporte Concluído",
  rate: "Avaliação",
};

const entityLabels: Record<string, string> = {
  user: "Usuário",
  transport_request: "Pedido de Transporte",
  transport_proposal: "Proposta",
  profile: "Perfil",
  kpi_settings: "Config. KPI",
  digital_contract: "Contrato Digital",
  chat_message: "Mensagem Chat",
  rating: "Avaliação",
};

export const ExportAuditPDFButton = ({ logs, getUserName, dateRange }: ExportAuditPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(34, 139, 34);
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("MOVA - Logs de Auditoria", 14, 25);

      // Date range info
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      let dateInfo = "Período: Todos os registros";
      if (dateRange?.from && dateRange?.to) {
        dateInfo = `Período: ${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}`;
      } else if (dateRange?.from) {
        dateInfo = `A partir de: ${format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })}`;
      }
      doc.text(dateInfo, 14, 35);

      // Reset text color
      doc.setTextColor(0, 0, 0);

      // Summary
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Resumo", 14, 55);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total de registros: ${logs.length}`, 14, 65);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 72);

      // Table
      const tableData = logs.map((log) => [
        format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        getUserName(log.user_id),
        actionLabels[log.action] || log.action,
        entityLabels[log.entity_type] || log.entity_type,
        log.details ? JSON.stringify(log.details).substring(0, 50) + "..." : "-",
      ]);

      autoTable(doc, {
        head: [["Data/Hora", "Usuário", "Ação", "Entidade", "Detalhes"]],
        body: tableData,
        startY: 80,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 35 },
          2: { cellWidth: 30 },
          3: { cellWidth: 35 },
          4: { cellWidth: "auto" },
        },
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Página ${i} de ${pageCount} - MOVA Agro © ${new Date().getFullYear()}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save
      const fileName = `mova_audit_logs_${format(new Date(), "yyyy-MM-dd_HH-mm")}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleExport} disabled={isExporting || logs.length === 0}>
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      Exportar PDF
    </Button>
  );
};
