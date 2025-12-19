import { Clock, Truck, AlertTriangle } from "lucide-react";

interface TravelTimeEstimateProps {
  distance: number;
}

export function calculateTravelTime(distance: number): {
  hours: number;
  minutes: number;
  formatted: string;
  speedAssumption: number;
} {
  // Average speed assumptions for truck transport in Mozambique
  // Considering road conditions, rest stops, and regulations
  const avgSpeed = 50; // km/h average including stops and road conditions
  
  const totalHours = distance / avgSpeed;
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  
  let formatted = "";
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    formatted = `${days} dia${days > 1 ? "s" : ""} e ${remainingHours}h`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}min`;
  } else {
    formatted = `${minutes} minutos`;
  }
  
  return {
    hours,
    minutes,
    formatted,
    speedAssumption: avgSpeed,
  };
}

export function TravelTimeEstimate({ distance }: TravelTimeEstimateProps) {
  const { formatted, hours, speedAssumption } = calculateTravelTime(distance);
  
  const isLongTrip = hours > 8;
  const isVeryLongTrip = hours > 24;
  
  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isVeryLongTrip ? "bg-orange-500/20" : "bg-primary/20"}`}>
          <Clock className={`w-5 h-5 ${isVeryLongTrip ? "text-orange-500" : "text-primary"}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">Tempo Estimado de Viagem</p>
          <p className="text-xl font-bold text-foreground">{formatted}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              Vel. média: {speedAssumption} km/h
            </span>
            {isLongTrip && (
              <span className="flex items-center gap-1 text-orange-500">
                <AlertTriangle className="w-3 h-3" />
                {isVeryLongTrip ? "Viagem longa - considere paradas" : "Recomendado paradas para descanso"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
