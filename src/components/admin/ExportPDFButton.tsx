import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExportPDFButtonProps {
  stats: {
    totalUsers: number;
    cooperatives: number;
    transporters: number;
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    completedRequests: number;
    totalProposals: number;
    pendingProposals: number;
    acceptedProposals: number;
    paidProposals: number;
    totalRevenue: number;
  };
  dateFilter: string;
}

export const ExportPDFButton = ({ stats, dateFilter }: ExportPDFButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(20);
      doc.setTextColor(34, 82, 67); // primary color
      doc.text("Relatório de Estatísticas", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth / 2, 30, { align: "center" });
      doc.text(`Período: ${dateFilter}`, pageWidth / 2, 38, { align: "center" });
      
      // Users Stats
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Usuários", 14, 55);
      
      autoTable(doc, {
        startY: 60,
        head: [["Métrica", "Valor"]],
        body: [
          ["Total de Usuários", stats.totalUsers.toString()],
          ["Cooperativas", stats.cooperatives.toString()],
          ["Transportadoras", stats.transporters.toString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
      });
      
      // Requests Stats
      const requestsY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Pedidos de Transporte", 14, requestsY);
      
      autoTable(doc, {
        startY: requestsY + 5,
        head: [["Métrica", "Valor"]],
        body: [
          ["Total de Pedidos", stats.totalRequests.toString()],
          ["Pendentes", stats.pendingRequests.toString()],
          ["Aceitos", stats.acceptedRequests.toString()],
          ["Concluídos", stats.completedRequests.toString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
      });
      
      // Proposals Stats
      const proposalsY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Propostas", 14, proposalsY);
      
      autoTable(doc, {
        startY: proposalsY + 5,
        head: [["Métrica", "Valor"]],
        body: [
          ["Total de Propostas", stats.totalProposals.toString()],
          ["Pendentes", stats.pendingProposals.toString()],
          ["Aceitas", stats.acceptedProposals.toString()],
          ["Pagas/Confirmadas", stats.paidProposals.toString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
      });
      
      // Revenue
      const revenueY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Receita", 14, revenueY);
      
      autoTable(doc, {
        startY: revenueY + 5,
        head: [["Métrica", "Valor"]],
        body: [
          ["Receita Total", `${stats.totalRevenue.toLocaleString("pt-MZ", { minimumFractionDigits: 2 })} MZN`],
          ["Transações Confirmadas", stats.paidProposals.toString()],
        ],
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
      });
      
      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("MovaAgro - Plataforma de Transporte Agrícola", pageWidth / 2, footerY, { align: "center" });
      
      doc.save(`relatorio-movaagro-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button onClick={exportToPDF} disabled={isExporting} variant="outline" size="sm">
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      Exportar PDF
    </Button>
  );
};
