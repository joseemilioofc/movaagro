import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, Package, Truck, Wheat, Trash2, Loader2, Shield, MessageSquare, TrendingUp, DollarSign, CheckCircle, Clock, Calendar, Bell, Pencil } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExportPDFButton } from "@/components/admin/ExportPDFButton";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { MonthlyComparisonChart } from "@/components/admin/MonthlyComparisonChart";
import { KPIDashboard } from "@/components/admin/KPIDashboard";
import { AdvancedAnalyticsDashboard } from "@/components/admin/AdvancedAnalyticsDashboard";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  created_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

interface TransportRequest {
  id: string;
  title: string;
  origin_address: string;
  destination_address: string;
  cargo_type: string;
  pickup_date: string;
  status: string;
  created_at: string;
}

interface Proposal {
  id: string;
  price: number;
  status: string;
  created_at: string;
}

type DateFilter = "7d" | "30d" | "90d" | "all";

const AdminDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ type: "user" | "request"; id: string } | null>(null);
  const [roleChangeDialog, setRoleChangeDialog] = useState<{ userId: string; userName: string; currentRole: string; newRole: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>("30d");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [profilesRes, rolesRes, requestsRes, proposalsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
        supabase.from("transport_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("transport_proposals").select("*").order("created_at", { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (requestsRes.error) throw requestsRes.error;
      if (proposalsRes.error) throw proposalsRes.error;

      setProfiles(profilesRes.data || []);
      setUserRoles(rolesRes.data || []);
      setRequests(requestsRes.data || []);
      setProposals(proposalsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time notifications
  useRealtimeNotifications({
    enabled: notificationsEnabled && (role === "admin" || role === "secondary_admin"),
    onNewRequest: fetchData,
  });

  const getFilterDate = (filter: DateFilter) => {
    const now = new Date();
    switch (filter) {
      case "7d": return subDays(now, 7);
      case "30d": return subDays(now, 30);
      case "90d": return subDays(now, 90);
      default: return null;
    }
  };

  const filteredData = useMemo(() => {
    const filterDate = getFilterDate(dateFilter);
    
    const filterByDate = <T extends { created_at: string }>(items: T[]) => {
      if (!filterDate) return items;
      return items.filter(item => isAfter(new Date(item.created_at), filterDate));
    };

    return {
      profiles: filterByDate(profiles),
      requests: filterByDate(requests),
      proposals: filterByDate(proposals),
    };
  }, [profiles, requests, proposals, dateFilter]);

  const chartData = useMemo(() => {
    const filterDate = getFilterDate(dateFilter);
    const days = dateFilter === "7d" ? 7 : dateFilter === "30d" ? 30 : dateFilter === "90d" ? 90 : 90;
    
    const data: { date: string; pedidos: number; propostas: number; usuarios: number }[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, "yyyy-MM-dd");
      const displayDate = format(date, "dd/MM", { locale: ptBR });
      
      const pedidos = requests.filter(r => format(new Date(r.created_at), "yyyy-MM-dd") === dateStr).length;
      const propostas = proposals.filter(p => format(new Date(p.created_at), "yyyy-MM-dd") === dateStr).length;
      const usuarios = profiles.filter(p => format(new Date(p.created_at), "yyyy-MM-dd") === dateStr).length;
      
      data.push({ date: displayDate, pedidos, propostas, usuarios });
    }
    
    // Group by week if more than 30 days
    if (days > 30) {
      const weeklyData: typeof data = [];
      for (let i = 0; i < data.length; i += 7) {
        const week = data.slice(i, i + 7);
        weeklyData.push({
          date: week[0]?.date || "",
          pedidos: week.reduce((sum, d) => sum + d.pedidos, 0),
          propostas: week.reduce((sum, d) => sum + d.propostas, 0),
          usuarios: week.reduce((sum, d) => sum + d.usuarios, 0),
        });
      }
      return weeklyData;
    }
    
    return data;
  }, [requests, proposals, profiles, dateFilter]);

  const isAnyAdmin = role === "admin" || role === "secondary_admin";
  const isSupremeAdmin = role === "admin";

  useEffect(() => {
    if (!authLoading && (!user || !isAnyAdmin)) {
      navigate("/auth?admin=true");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && isAnyAdmin) {
      fetchData();
    }
  }, [user, role]);

  useEffect(() => {
    if (user && isAnyAdmin) {
      fetchData();
    }
  }, [user, role, fetchData]);

  const getUserRole = (userId: string) => {
    const userRole = userRoles.find((r) => r.user_id === userId);
    return userRole?.role || "unknown";
  };

  const getRoleBadge = (roleName: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      admin: { label: "Admin Supremo", variant: "default" },
      secondary_admin: { label: "Admin Secundário", variant: "default" },
      cooperative: { label: "Cooperativa", variant: "secondary" },
      transporter: { label: "Transportadora", variant: "outline" },
    };
    const roleConfig = config[roleName] || { label: roleName, variant: "outline" };
    return <Badge variant={roleConfig.variant}>{roleConfig.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "secondary" },
      accepted: { label: "Aceito", variant: "default" },
      rejected: { label: "Recusado", variant: "destructive" },
      completed: { label: "Concluído", variant: "outline" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog || deleteDialog.type !== "user") return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", deleteDialog.id);
      if (error) throw error;

      toast({ title: "Usuário removido", description: "O usuário foi removido com sucesso." });
      setDeleteDialog(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro ao remover usuário", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteRequest = async () => {
    if (!deleteDialog || deleteDialog.type !== "request") return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from("transport_requests").delete().eq("id", deleteDialog.id);
      if (error) throw error;

      toast({ title: "Pedido removido", description: "O pedido foi removido com sucesso." });
      setDeleteDialog(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro ao remover pedido", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
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

  const roleOptions = [
    { value: "admin", label: "Admin Supremo" },
    { value: "secondary_admin", label: "Admin Secundário" },
    { value: "cooperative", label: "Cooperativa" },
    { value: "transporter", label: "Transportadora" },
  ];

  const handleRoleChangeRequest = (userId: string, newRole: string) => {
    if (userId === user?.id) {
      toast({ title: "Ação bloqueada", description: "Não é possível alterar seu próprio papel.", variant: "destructive" });
      return;
    }
    const profile = profiles.find(p => p.user_id === userId);
    setRoleChangeDialog({
      userId,
      userName: profile?.name || "Usuário",
      currentRole: getUserRole(userId),
      newRole,
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!roleChangeDialog) return;
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: roleChangeDialog.newRole as any })
        .eq("user_id", roleChangeDialog.userId);

      if (error) throw error;

      toast({ title: "Papel atualizado", description: `Papel alterado para ${roleOptions.find(r => r.value === roleChangeDialog.newRole)?.label}.` });
      setRoleChangeDialog(null);
      fetchData();
    } catch (error: any) {
      toast({ title: "Erro ao alterar papel", description: error.message, variant: "destructive" });
      setRoleChangeDialog(null);
    }
  };

  const cooperatives = filteredData.profiles.filter((p) => getUserRole(p.user_id) === "cooperative");
  const transporters = filteredData.profiles.filter((p) => getUserRole(p.user_id) === "transporter");
  
  // Statistics calculations using filtered data
  const pendingRequests = filteredData.requests.filter((r) => r.status === "pending").length;
  const acceptedRequests = filteredData.requests.filter((r) => r.status === "accepted").length;
  const completedRequests = filteredData.requests.filter((r) => r.status === "completed").length;
  
  const pendingProposals = filteredData.proposals.filter((p) => p.status === "pending").length;
  const acceptedProposals = filteredData.proposals.filter((p) => p.status === "accepted").length;
  const paidProposals = filteredData.proposals.filter((p) => p.status === "paid" || p.status === "admin_confirmed").length;
  
  const totalRevenue = filteredData.proposals
    .filter((p) => p.status === "paid" || p.status === "admin_confirmed")
    .reduce((sum, p) => sum + (p.price || 0), 0);
  
  const thisMonthUsers = profiles.filter((p) => {
    const createdAt = new Date(p.created_at);
    const now = new Date();
    return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
  }).length;

  const dateFilterLabels: Record<DateFilter, string> = {
    "7d": "Últimos 7 dias",
    "30d": "Últimos 30 dias",
    "90d": "Últimos 90 dias",
    "all": "Todo período",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with Date Filter */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">Painel Administrativo</h1>
                <p className="text-muted-foreground">Gerencie usuários e pedidos da plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Bell className={`w-4 h-4 ${notificationsEnabled ? "text-primary" : "text-muted-foreground"}`} />
                <Label htmlFor="notifications" className="text-sm">Notificações</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 dias</SelectItem>
                  <SelectItem value="30d">30 dias</SelectItem>
                  <SelectItem value="90d">90 dias</SelectItem>
                  <SelectItem value="all">Tudo</SelectItem>
                </SelectContent>
              </Select>
              <ExportPDFButton
                stats={{
                  totalUsers: profiles.length,
                  cooperatives: cooperatives.length,
                  transporters: transporters.length,
                  totalRequests: requests.length,
                  pendingRequests,
                  acceptedRequests,
                  completedRequests,
                  totalProposals: proposals.length,
                  pendingProposals,
                  acceptedProposals,
                  paidProposals,
                  totalRevenue,
                }}
                dateFilter={dateFilterLabels[dateFilter]}
              />
              {isSupremeAdmin && <CreateUserDialog onUserCreated={fetchData} />}
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuários</p>
                  <p className="text-2xl font-bold">{profiles.length}</p>
                  <p className="text-xs text-muted-foreground">+{thisMonthUsers} este mês</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Wheat className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cooperativas</p>
                  <p className="text-2xl font-bold">{cooperatives.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transportadoras</p>
                  <p className="text-2xl font-bold">{transporters.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Pedidos</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Request Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Status dos Pedidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <Badge variant="secondary">{pendingRequests}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Aceitos</span>
                  </div>
                  <Badge variant="default">{acceptedRequests}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Concluídos</span>
                  </div>
                  <Badge variant="outline">{completedRequests}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Status das Propostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Pendentes</span>
                  </div>
                  <Badge variant="secondary">{pendingProposals}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Aceitas</span>
                  </div>
                  <Badge variant="default">{acceptedProposals}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Pagas</span>
                  </div>
                  <Badge variant="outline">{paidProposals}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">
                  {totalRevenue.toLocaleString("pt-MZ", { minimumFractionDigits: 2 })} MZN
                </p>
                <p className="text-sm text-muted-foreground">
                  De {paidProposals} transações confirmadas
                </p>
                <p className="text-sm text-muted-foreground">
                  Total de propostas: {filteredData.proposals.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Evolução ao Longo do Tempo
            </CardTitle>
            <CardDescription>
              {dateFilterLabels[dateFilter]} - Pedidos, propostas e novos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPropostas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pedidos"
                    name="Pedidos"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPedidos)"
                  />
                  <Area
                    type="monotone"
                    dataKey="propostas"
                    name="Propostas"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorPropostas)"
                  />
                  <Area
                    type="monotone"
                    dataKey="usuarios"
                    name="Usuários"
                    stroke="hsl(var(--chart-3))"
                    fillOpacity={1}
                    fill="url(#colorUsuarios)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* KPI Dashboard */}
        <KPIDashboard
          profiles={profiles}
          requests={requests}
          proposals={proposals}
          adminEmails={profiles
            .filter((p) => userRoles.find((r) => r.user_id === p.user_id && r.role === "admin"))
            .map((p) => p.email)}
        />

        {/* Monthly Comparison Chart */}
        <MonthlyComparisonChart
          requests={requests}
          proposals={proposals}
          profiles={profiles}
        />

        {/* Advanced Analytics Dashboard */}
        <AdvancedAnalyticsDashboard
          profiles={profiles}
          requests={requests}
          proposals={proposals}
        />

        {/* Tabs */}
        <Tabs defaultValue={isSupremeAdmin ? "users" : "requests"}>
          <TabsList>
            {isSupremeAdmin && <TabsTrigger value="users">Usuários</TabsTrigger>}
            <TabsTrigger value="requests">Pedidos</TabsTrigger>
          </TabsList>

          {isSupremeAdmin && (
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Usuários Cadastrados</CardTitle>
                  <CardDescription>Lista de todos os usuários da plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Cadastro</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>
                            <Select
                              value={getUserRole(profile.user_id)}
                              onValueChange={(value) => handleRoleChangeRequest(profile.user_id, value)}
                              disabled={profile.user_id === user?.id}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {roleOptions.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{new Date(profile.created_at).toLocaleDateString("pt-BR")}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteDialog({ type: "user", id: profile.id })}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="requests" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos de Transporte</CardTitle>
                <CardDescription>Lista de todos os pedidos da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Rota</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.title}</TableCell>
                        <TableCell className="text-sm">
                          {request.origin_address} → {request.destination_address}
                        </TableCell>
                        <TableCell>{request.cargo_type}</TableCell>
                        <TableCell>{new Date(request.pickup_date).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {request.status === "accepted" && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/chat/${request.id}`)}
                                title="Abrir chat"
                              >
                                <MessageSquare className="w-4 h-4 text-primary" />
                              </Button>
                            )}
                            {isSupremeAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteDialog({ type: "request", id: request.id })}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir este {deleteDialog?.type === "user" ? "usuário" : "pedido"}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialog(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={deleteDialog?.type === "user" ? handleDeleteUser : handleDeleteRequest}
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Role Change Confirmation Dialog */}
        <Dialog open={!!roleChangeDialog} onOpenChange={() => setRoleChangeDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar alteração de papel</DialogTitle>
              <DialogDescription>
                Deseja alterar o papel de <strong>{roleChangeDialog?.userName}</strong> de{" "}
                <strong>{roleOptions.find(r => r.value === roleChangeDialog?.currentRole)?.label}</strong> para{" "}
                <strong>{roleOptions.find(r => r.value === roleChangeDialog?.newRole)?.label}</strong>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleChangeDialog(null)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmRoleChange}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
