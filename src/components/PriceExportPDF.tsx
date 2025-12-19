import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMZN } from "@/lib/currency";

interface PriceExportPDFProps {
  origin: string;
  destination: string;
  cargoType: string;
  cargoLabel: string;
  weight: number;
  distance: number;
  priceMin: number;
  priceMax: number;
  travelTime?: string;
}

export function PriceExportPDF({
  origin,
  destination,
  cargoType,
  cargoLabel,
  weight,
  distance,
  priceMin,
  priceMax,
  travelTime,
}: PriceExportPDFProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(34, 139, 34); // Primary green
      doc.rect(0, 0, pageWidth, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("MOVA AGRO", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Cotação de Transporte Agrícola", pageWidth / 2, 32, { align: "center" });
      
      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Document info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString("pt-MZ", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(`Data: ${date}`, 14, 55);
      doc.text(`Documento: COT-${Date.now().toString().slice(-8)}`, pageWidth - 14, 55, { align: "right" });
      
      // Main content title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Detalhes da Cotação", 14, 70);
      
      // Line separator
      doc.setDrawColor(34, 139, 34);
      doc.setLineWidth(0.5);
      doc.line(14, 74, pageWidth - 14, 74);
      
      // Route info table
      autoTable(doc, {
        startY: 80,
        head: [["Informação", "Valor"]],
        body: [
          ["Origem", origin],
          ["Destino", destination],
          ["Tipo de Carga", cargoLabel],
          ["Peso", `${weight} toneladas`],
          ["Distância Estimada", `${distance} km`],
          ...(travelTime ? [["Tempo Estimado de Viagem", travelTime]] : []),
        ],
        theme: "striped",
        headStyles: {
          fillColor: [34, 139, 34],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        styles: {
          fontSize: 11,
          cellPadding: 6,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      // Price section
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Valores Estimados", 14, finalY);
      
      doc.setDrawColor(34, 139, 34);
      doc.line(14, finalY + 4, pageWidth - 14, finalY + 4);
      
      // Price cards
      const priceY = finalY + 15;
      const cardWidth = (pageWidth - 42) / 3;
      
      // Min price card
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(14, priceY, cardWidth, 35, 3, 3, "F");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Preço Mínimo", 14 + cardWidth / 2, priceY + 12, { align: "center" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(34, 139, 34);
      doc.text(formatMZN(priceMin), 14 + cardWidth / 2, priceY + 26, { align: "center" });
      
      // Max price card
      doc.setFillColor(254, 243, 199);
      doc.roundedRect(14 + cardWidth + 7, priceY, cardWidth, 35, 3, 3, "F");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Preço Máximo", 14 + cardWidth * 1.5 + 7, priceY + 12, { align: "center" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(180, 83, 9);
      doc.text(formatMZN(priceMax), 14 + cardWidth * 1.5 + 7, priceY + 26, { align: "center" });
      
      // Avg price card
      const avgPrice = (priceMin + priceMax) / 2;
      doc.setFillColor(219, 234, 254);
      doc.roundedRect(14 + cardWidth * 2 + 14, priceY, cardWidth, 35, 3, 3, "F");
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("Preço Médio", 14 + cardWidth * 2.5 + 14, priceY + 12, { align: "center" });
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(29, 78, 216);
      doc.text(formatMZN(avgPrice), 14 + cardWidth * 2.5 + 14, priceY + 26, { align: "center" });
      
      // Footer notes
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      const notesY = priceY + 50;
      doc.text("Notas importantes:", 14, notesY);
      doc.setFont("helvetica", "normal");
      doc.text("• Este é um valor estimado sujeito a variação conforme disponibilidade e negociação.", 14, notesY + 8);
      doc.text("• O preço final será acordado entre as partes envolvidas.", 14, notesY + 14);
      doc.text("• Condições da rota e urgência podem afetar o valor final.", 14, notesY + 20);
      
      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setDrawColor(200, 200, 200);
      doc.line(14, footerY - 10, pageWidth - 14, footerY - 10);
      
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("MOVA AGRO - Conectando o agronegócio de Moçambique", pageWidth / 2, footerY, { align: "center" });
      doc.text("www.movaagro.co.mz | suporte@movaagro.co.mz", pageWidth / 2, footerY + 6, { align: "center" });
      
      // Save
      const fileName = `cotacao-mova-${origin.toLowerCase().replace(/\s+/g, "-")}-${destination.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.pdf`;
      doc.save(fileName);
      
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Erro ao exportar PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={exporting}
      className="gap-2"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4" />
      )}
      Exportar PDF
    </Button>
  );
}
