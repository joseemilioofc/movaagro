import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Users, Package, Truck, Wheat, Trash2, Loader2, Shield } from "lucide-react";

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

const AdminDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ type: "user" | "request"; id: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      navigate("/auth?admin=true");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === "admin") {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    try {
      const [profilesRes, rolesRes, requestsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
        supabase.from("transport_requests").select("*").order("created_at", { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      if (requestsRes.error) throw requestsRes.error;

      setProfiles(profilesRes.data || []);
      setUserRoles(rolesRes.data || []);
      setRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserRole = (userId: string) => {
    const userRole = userRoles.find((r) => r.user_id === userId);
    return userRole?.role || "unknown";
  };

  const getRoleBadge = (role: string) => {
    const config: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      admin: { label: "Admin", variant: "default" },
      cooperative: { label: "Cooperativa", variant: "secondary" },
      transporter: { label: "Transportadora", variant: "outline" },
    };
    const roleConfig = config[role] || { label: role, variant: "outline" };
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

  const cooperatives = profiles.filter((p) => getUserRole(p.user_id) === "cooperative");
  const transporters = profiles.filter((p) => getUserRole(p.user_id) === "transporter");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Painel Administrativo</h1>
            <p className="text-muted-foreground">Gerencie usuários e pedidos da plataforma</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuários</p>
                  <p className="text-2xl font-bold">{profiles.length}</p>
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
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="text-2xl font-bold">{requests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="requests">Pedidos</TabsTrigger>
          </TabsList>

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
                        <TableCell>{getRoleBadge(getUserRole(profile.user_id))}</TableCell>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ type: "request", id: request.id })}
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
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
