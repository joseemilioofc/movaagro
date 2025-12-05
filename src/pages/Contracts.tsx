import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DigitalContract } from "@/components/DigitalContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  FileText, 
  Search, 
  Filter, 
  Loader2, 
  CheckCircle2, 
  Clock,
  Calendar,
  X,
  FileDown
} from "lucide-react";
import { formatMZN } from "@/lib/currency";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Contract {
  id: string;
  contract_number: string;
  transport_request_id: string;
  proposal_id: string;
  cooperative_id: string;
  transporter_id: string;
  terms: string;
  price: number;
  pickup_date: string;
  origin_address: string;
  destination_address: string;
  cargo_type: string;
  weight_kg: number | null;
  cooperative_signature: string | null;
  cooperative_signed_at: string | null;
  transporter_signature: string | null;
  transporter_signed_at: string | null;
  status: string;
  created_at: string;
}

const Contracts = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [profileNames, setProfileNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter, dateFilter]);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("digital_contracts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts((data as Contract[]) || []);

      // Fetch profile names
      const userIds = new Set<string>();
      (data || []).forEach((c: Contract) => {
        userIds.add(c.cooperative_id);
        userIds.add(c.transporter_id);
      });

      if (userIds.size > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", Array.from(userIds));

        if (profiles) {
          const names: Record<string, string> = {};
          profiles.forEach(p => { names[p.user_id] = p.name; });
          setProfileNames(names);
        }
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterContracts = () => {
    let filtered = [...contracts];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.contract_number.toLowerCase().includes(term) ||
        c.origin_address.toLowerCase().includes(term) ||
        c.destination_address.toLowerCase().includes(term) ||
        c.cargo_type.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(c => 
        new Date(c.pickup_date).toISOString().split("T")[0] === dateFilter
      );
    }

    setFilteredContracts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  const getStatusBadge = (status: string, coopSigned: boolean, transSigned: boolean) => {
    if (status === "signed") {
      return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Assinado</Badge>;
    }
    if (coopSigned && !transSigned) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Aguardando Transportador</Badge>;
    }
    if (!coopSigned && transSigned) {
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Aguardando Cooperativa</Badge>;
    }
    return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
  };

  const stats = {
    total: contracts.length,
    pending: contracts.filter(c => c.status === "pending").length,
    signed: contracts.filter(c => c.status === "signed").length,
    totalValue: contracts.reduce((sum, c) => sum + Number(c.price || 0), 0),
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      doc.setFontSize(20);
      doc.setTextColor(34, 82, 67);
      doc.text("Histórico de Contratos", pageWidth / 2, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth / 2, 30, { align: "center" });
      
      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Resumo", 14, 45);
      
      autoTable(doc, {
        startY: 50,
        head: [["Métrica", "Valor"]],
        body: [
          ["Total de Contratos", stats.total.toString()],
          ["Contratos Pendentes", stats.pending.toString()],
          ["Contratos Assinados", stats.signed.toString()],
          ["Valor Total", formatMZN(stats.totalValue)],
        ],
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
      });
      
      // Contracts table
      const contractsY = (doc as any).lastAutoTable.finalY + 15;
      doc.text("Lista de Contratos", 14, contractsY);
      
      autoTable(doc, {
        startY: contractsY + 5,
        head: [["Nº Contrato", "Origem", "Destino", "Data", "Valor", "Status"]],
        body: filteredContracts.map(c => [
          c.contract_number,
          c.origin_address.substring(0, 20) + "...",
          c.destination_address.substring(0, 20) + "...",
          new Date(c.pickup_date).toLocaleDateString("pt-MZ"),
          formatMZN(c.price),
          c.status === "signed" ? "Assinado" : "Pendente",
        ]),
        theme: "striped",
        headStyles: { fillColor: [34, 82, 67] },
        styles: { fontSize: 8 },
      });
      
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text("MovaAgro - Plataforma de Transporte Agrícola", pageWidth / 2, footerY, { align: "center" });
      
      doc.save(`contratos-${format(new Date(), "yyyy-MM-dd")}.pdf`);
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF");
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Contratos</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Gerencie seus contratos</p>
          </div>
          <Button onClick={exportPDF} variant="outline" size="sm" className="self-start sm:self-auto">
            <FileDown className="w-4 h-4 mr-2" />
            <span className="sm:inline">PDF</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-light rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Assinados</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.signed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <span className="text-sm sm:text-lg font-bold text-primary">MZN</span>
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Valor</p>
                  <p className="text-lg sm:text-xl font-bold">{formatMZN(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
              <div className="relative col-span-2 md:col-span-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 sm:h-10 text-sm"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 sm:h-10 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="signed">Assinado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  placeholder="Data"
                  className="h-9 sm:h-10 text-sm"
                />
              </div>
              <div>
                <Button variant="outline" onClick={clearFilters} className="w-full h-9 sm:h-10 text-sm">
                  <X className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Limpar</span>
                  <span className="sm:hidden">X</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card>
          <CardHeader>
            <CardTitle>Meus Contratos</CardTitle>
            <CardDescription>
              {filteredContracts.length} contrato(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum contrato encontrado</p>
                {(searchTerm || statusFilter !== "all" || dateFilter) && (
                  <Button variant="link" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4 cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium font-mono">{contract.contract_number}</h4>
                        <p className="text-sm text-muted-foreground">
                          {contract.origin_address} → {contract.destination_address}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(contract.pickup_date).toLocaleDateString("pt-MZ")}
                          </span>
                          <span className="font-medium text-primary">
                            {formatMZN(contract.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(
                        contract.status, 
                        !!contract.cooperative_signature, 
                        !!contract.transporter_signature
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Details Dialog */}
        <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Contrato</DialogTitle>
              <DialogDescription>{selectedContract?.contract_number}</DialogDescription>
            </DialogHeader>
            {selectedContract && (
              <DigitalContract
                contract={selectedContract}
                cooperativeName={profileNames[selectedContract.cooperative_id] || "Cooperativa"}
                transporterName={profileNames[selectedContract.transporter_id] || "Transportador"}
                onUpdate={fetchContracts}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Contracts;
