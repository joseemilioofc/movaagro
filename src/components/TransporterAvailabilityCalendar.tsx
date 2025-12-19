import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Truck, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, addMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AvailabilityData {
  date: string;
  count: number;
}

export function TransporterAvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date());

  useEffect(() => {
    fetchAvailability();
  }, [month]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(month), "yyyy-MM-dd");
      const endDate = format(endOfMonth(addMonths(month, 1)), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("transporter_availability")
        .select("date")
        .eq("is_available", true)
        .gte("date", startDate)
        .lte("date", endDate);

      if (error) throw error;

      // Count transporters per date
      const countMap = new Map<string, number>();
      data?.forEach((item) => {
        const dateStr = item.date;
        countMap.set(dateStr, (countMap.get(dateStr) || 0) + 1);
      });

      const availability = Array.from(countMap.entries()).map(([date, count]) => ({
        date,
        count,
      }));

      setAvailabilityData(availability);
    } catch (error) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityForDate = (date: Date): number => {
    const dateStr = format(date, "yyyy-MM-dd");
    const found = availabilityData.find((a) => a.date === dateStr);
    return found?.count || 0;
  };

  const selectedDateAvailability = selectedDate ? getAvailabilityForDate(selectedDate) : 0;

  const modifiers = {
    available: (date: Date) => getAvailabilityForDate(date) > 0,
    highAvailability: (date: Date) => getAvailabilityForDate(date) >= 5,
    lowAvailability: (date: Date) => {
      const count = getAvailabilityForDate(date);
      return count > 0 && count < 5;
    },
  };

  const modifiersClassNames = {
    available: "bg-green-500/20 text-green-700 dark:text-green-400 font-semibold",
    highAvailability: "bg-green-500/30 text-green-700 dark:text-green-400 font-bold",
    lowAvailability: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          Disponibilidade de Transportadores
        </CardTitle>
        <CardDescription>
          Veja quantos transportadores estão disponíveis por data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={setMonth}
              locale={pt}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              className={cn("p-3 pointer-events-auto rounded-lg border")}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </div>
          
          <div className="space-y-4">
            {selectedDate && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt })}
                </p>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${selectedDateAvailability > 0 ? "bg-green-500/20" : "bg-muted"}`}>
                    <Truck className={`w-6 h-6 ${selectedDateAvailability > 0 ? "text-green-600" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {selectedDateAvailability}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      transportador{selectedDateAvailability !== 1 ? "es" : ""} disponíve{selectedDateAvailability !== 1 ? "is" : "l"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Legenda:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-500/30 text-green-700 dark:text-green-400 border-green-500/50">
                  <Users className="w-3 h-3 mr-1" />
                  5+ disponíveis
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/50">
                  <Users className="w-3 h-3 mr-1" />
                  1-4 disponíveis
                </Badge>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Sem disponibilidade
                </Badge>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              💡 Para transportadores: configure sua disponibilidade no seu painel de controle.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
