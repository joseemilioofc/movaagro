import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollText, Loader2, Search, Filter, ChevronLeft, ChevronRight, BarChart3, List } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExportExcelButton } from "@/components/admin/ExportExcelButton";
import { ExportAuditPDFButton } from "@/components/admin/ExportAuditPDFButton";
import { AuditStatsDashboard } from "@/components/admin/AuditStatsDashboard";
import { DateRangePicker } from "@/components/admin/DateRangePicker";

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

interface Profile {
  user_id: string;
  name: string;
  email: string;
}

const ITEMS_PER_PAGE = 20;

const AuditLogs = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [allLogs, setAllLogs] = useState<AuditLog[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeTab, setActiveTab] = useState("stats");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const isAnyAdmin = role === "admin";

  useEffect(() => {
    if (!authLoading && (!user || !isAnyAdmin)) {
      navigate("/auth?admin=true");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && isAnyAdmin) {
      fetchData();
    }
  }, [user, role, currentPage]);

  // Fetch all logs for stats when filters/date change
  useEffect(() => {
    if (user && isAnyAdmin) {
      fetchAllLogs();
    }
  }, [user, role]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [actionFilter, entityFilter, searchTerm, dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from("audit_logs")
        .select("*", { count: "exact", head: true });

      setTotalCount(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const [logsRes, profilesRes] = await Promise.all([
        supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false })
          .range(from, to),
        supabase.from("profiles").select("user_id, name, email"),
      ]);

      if (logsRes.error) throw logsRes.error;
      if (profilesRes.error) throw profilesRes.error;

      setLogs(logsRes.data || []);
      setProfiles(profilesRes.data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllLogs = async () => {
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) throw error;
      setAllLogs(data || []);
    } catch (error) {
      console.error("Error fetching all logs:", error);
    }
  };

  const getUserName = (userId: string) => {
    const profile = profiles.find((p) => p.user_id === userId);
    return profile?.name || "Desconhecido";
  };

  const getActionBadge = (action: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      create: { label: "Criação", variant: "default" },
      update: { label: "Atualização", variant: "secondary" },
      delete: { label: "Exclusão", variant: "destructive" },
      login: { label: "Login", variant: "outline" },
      logout: { label: "Logout", variant: "outline" },
      email_sent: { label: "Email Enviado", variant: "secondary" },
      view: { label: "Visualização", variant: "outline" },
      accept: { label: "Aceito", variant: "default" },
      reject: { label: "Rejeitado", variant: "destructive" },
      sign_contract: { label: "Contrato Assinado", variant: "default" },
      send_message: { label: "Mensagem", variant: "secondary" },
      submit_proposal: { label: "Proposta", variant: "default" },
      complete_transport: { label: "Transporte Concluído", variant: "default" },
      rate: { label: "Avaliação", variant: "secondary" },
    };
    const actionConfig = config[action] || { label: action, variant: "outline" };
    return <Badge variant={actionConfig.variant}>{actionConfig.label}</Badge>;
  };

  const getEntityLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      user: "Usuário",
      transport_request: "Pedido",
      transport_proposal: "Proposta",
      profile: "Perfil",
      kpi_settings: "Config. KPI",
      digital_contract: "Contrato",
      chat_message: "Mensagem",
      rating: "Avaliação",
    };
    return labels[entityType] || entityType;
  };

  const uniqueActions = [...new Set(logs.map((l) => l.action))];
  const uniqueEntities = [...new Set(logs.map((l) => l.entity_type))];

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesEntity = entityFilter === "all" || log.entity_type === entityFilter;
    const matchesSearch =
      searchTerm === "" ||
      getUserName(log.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const logDate = new Date(log.created_at);
      if (dateRange.from && dateRange.to) {
        matchesDate = isWithinInterval(logDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        });
      } else if (dateRange.from) {
        matchesDate = logDate >= startOfDay(dateRange.from);
      } else if (dateRange.to) {
        matchesDate = logDate <= endOfDay(dateRange.to);
      }
    }

    return matchesAction && matchesEntity && matchesSearch && matchesDate;
  });

  const filteredAllLogs = allLogs.filter((log) => {
    let matchesDate = true;
    if (dateRange.from || dateRange.to) {
      const logDate = new Date(log.created_at);
      if (dateRange.from && dateRange.to) {
        matchesDate = isWithinInterval(logDate, {
          start: startOfDay(dateRange.from),
          end: endOfDay(dateRange.to),
        });
      } else if (dateRange.from) {
        matchesDate = logDate >= startOfDay(dateRange.from);
      } else if (dateRange.to) {
        matchesDate = logDate <= endOfDay(dateRange.to);
      }
    }
    return matchesDate;
  });

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Logs de Auditoria</h1>
              <p className="text-muted-foreground">Histórico completo de ações na plataforma</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ExportAuditPDFButton logs={filteredLogs} getUserName={getUserName} dateRange={dateRange} />
            <ExportExcelButton logs={filteredLogs} getUserName={getUserName} />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="stats" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <List className="w-4 h-4" />
              Registros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <AuditStatsDashboard logs={filteredAllLogs} profiles={profiles} />
          </TabsContent>

          <TabsContent value="logs" className="mt-6 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros Avançados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por usuário, ação..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
                  <Select value={actionFilter} onValueChange={setActionFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Ações</SelectItem>
                      {uniqueActions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={entityFilter} onValueChange={setEntityFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Entidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Entidades</SelectItem>
                      {uniqueEntities.map((entity) => (
                        <SelectItem key={entity} value={entity}>
                          {getEntityLabel(entity)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Registros ({totalCount} total)</CardTitle>
                <CardDescription>Página {currentPage} de {totalPages || 1}</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ScrollText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum registro de auditoria encontrado.</p>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data/Hora</TableHead>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Ação</TableHead>
                          <TableHead>Entidade</TableHead>
                          <TableHead>Detalhes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="whitespace-nowrap">
                              {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="font-medium">{getUserName(log.user_id)}</TableCell>
                            <TableCell>{getActionBadge(log.action)}</TableCell>
                            <TableCell>{getEntityLabel(log.entity_type)}</TableCell>
                            <TableCell className="max-w-[300px] truncate">
                              {log.details ? JSON.stringify(log.details) : "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} de {totalCount}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </Button>
                        <span className="text-sm font-medium px-2">
                          {currentPage} / {totalPages || 1}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                        >
                          Próxima
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
