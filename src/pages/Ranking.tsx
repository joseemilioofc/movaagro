import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RatingDisplay } from "@/components/RatingDisplay";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Medal, Award, Loader2, Star, TrendingUp, Users } from "lucide-react";

interface TransporterRanking {
  userId: string;
  name: string;
  averageRating: number;
  totalRatings: number;
  completedTransports: number;
}

const Ranking = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [rankings, setRankings] = useState<TransporterRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("rating");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRankings();
    }
  }, [user]);

  const fetchRankings = async () => {
    try {
      // Get all transporters
      const { data: transporterRoles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "transporter");

      if (!transporterRoles) return;

      const transporterIds = transporterRoles.map(r => r.user_id);

      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", transporterIds);

      // Get ratings for each transporter
      const { data: ratings } = await supabase
        .from("ratings" as any)
        .select("reviewed_id, rating")
        .in("reviewed_id", transporterIds);

      // Get completed transports count
      const { data: transports } = await supabase
        .from("transport_requests")
        .select("transporter_id")
        .eq("status", "completed")
        .in("transporter_id", transporterIds);

      // Build rankings
      const rankingMap = new Map<string, TransporterRanking>();

      profiles?.forEach(p => {
        rankingMap.set(p.user_id, {
          userId: p.user_id,
          name: p.name,
          averageRating: 0,
          totalRatings: 0,
          completedTransports: 0,
        });
      });

      // Aggregate ratings
      const ratingAggregates = new Map<string, { total: number; count: number }>();
      (ratings as any[] || []).forEach(r => {
        const existing = ratingAggregates.get(r.reviewed_id) || { total: 0, count: 0 };
        ratingAggregates.set(r.reviewed_id, {
          total: existing.total + r.rating,
          count: existing.count + 1,
        });
      });

      ratingAggregates.forEach((value, key) => {
        const ranking = rankingMap.get(key);
        if (ranking) {
          ranking.averageRating = value.total / value.count;
          ranking.totalRatings = value.count;
        }
      });

      // Count completed transports
      (transports || []).forEach(t => {
        if (t.transporter_id) {
          const ranking = rankingMap.get(t.transporter_id);
          if (ranking) {
            ranking.completedTransports++;
          }
        }
      });

      setRankings(Array.from(rankingMap.values()));
    } catch (error) {
      console.error("Error fetching rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedRankings = [...rankings].sort((a, b) => {
    if (sortBy === "rating") {
      return b.averageRating - a.averageRating;
    } else if (sortBy === "reviews") {
      return b.totalRatings - a.totalRatings;
    } else {
      return b.completedTransports - a.completedTransports;
    }
  });

  const getRankIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (position === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (position === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{position + 1}</span>;
  };

  const getRankBg = (position: number) => {
    if (position === 0) return "bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/30";
    if (position === 1) return "bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/30";
    if (position === 2) return "bg-gradient-to-r from-amber-600/10 to-amber-600/5 border-amber-600/30";
    return "bg-muted/50";
  };

  const stats = {
    totalTransporters: rankings.length,
    avgRating: rankings.length > 0 
      ? rankings.reduce((sum, r) => sum + r.averageRating, 0) / rankings.filter(r => r.averageRating > 0).length 
      : 0,
    totalReviews: rankings.reduce((sum, r) => sum + r.totalRatings, 0),
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
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground flex items-center gap-2 sm:gap-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            Ranking
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Transportadores mais bem avaliados</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalTransporters}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Média</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Avaliações</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.totalReviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ranking List */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
            <div>
              <CardTitle className="text-lg sm:text-xl">Classificação</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Baseado em avaliações</CardDescription>
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Maior Avaliação</SelectItem>
                <SelectItem value="reviews">Mais Avaliações</SelectItem>
                <SelectItem value="transports">Mais Transportes</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {sortedRankings.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum transportador encontrado</p>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {sortedRankings.map((transporter, index) => (
                  <div
                    key={transporter.userId}
                    className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border transition-all ${getRankBg(index)}`}
                  >
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                        {getRankIcon(index)}
                      </div>
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm sm:text-base">
                          {transporter.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{transporter.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                          <RatingDisplay
                            rating={transporter.averageRating}
                            totalRatings={transporter.totalRatings}
                            showBadges={false}
                            size="sm"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        {transporter.completedTransports} <span className="hidden sm:inline">transportes</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Ranking;
