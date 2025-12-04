import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DigitalContract } from "@/components/DigitalContract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  X
} from "lucide-react";
import { formatMZN } from "@/lib/currency";

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
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Contratos Digitais</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus contratos de transporte</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assinados</p>
                  <p className="text-2xl font-bold">{stats.signed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">MZN</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-xl font-bold">{formatMZN(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, endereço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
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
                  placeholder="Data de coleta"
                />
              </div>
              <div>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="w-4 h-4 mr-2" />
                  Limpar filtros
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
