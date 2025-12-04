import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Play, Square, Clock, Gauge, AlertCircle } from "lucide-react";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GPSTrackingMapProps {
  transportRequestId: string;
  transporterId?: string;
  isTransporter: boolean;
  originAddress: string;
  destinationAddress: string;
}

export const GPSTrackingMap = ({
  transportRequestId,
  transporterId,
  isTransporter,
  originAddress,
  destinationAddress,
}: GPSTrackingMapProps) => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const {
    currentLocation,
    locationHistory,
    isTracking,
    startTracking,
    stopTracking,
  } = useGPSTracking({
    transportRequestId,
    transporterId,
    isTransporter,
  });

  const mapUrl = currentLocation && mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l+ef4444(${currentLocation.longitude},${currentLocation.latitude})/${currentLocation.longitude},${currentLocation.latitude},12,0/600x400@2x?access_token=${mapboxToken}`
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Rastreamento GPS em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5" />
            <div>
              <p className="text-sm font-medium">Origem</p>
              <p className="text-sm text-muted-foreground">{originAddress}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5" />
            <div>
              <p className="text-sm font-medium">Destino</p>
              <p className="text-sm text-muted-foreground">{destinationAddress}</p>
            </div>
          </div>
        </div>

        {/* Transporter Controls */}
        {isTransporter && (
          <div className="flex gap-2">
            {!isTracking ? (
              <Button onClick={startTracking} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Iniciar Rastreamento
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="destructive" className="flex items-center gap-2">
                <Square className="h-4 w-4" />
                Parar Rastreamento
              </Button>
            )}
            <Badge variant={isTracking ? "default" : "secondary"}>
              {isTracking ? "Rastreando" : "Parado"}
            </Badge>
          </div>
        )}

        {/* Current Location Info */}
        {currentLocation ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  Latitude
                </div>
                <p className="font-mono text-sm">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" />
                  Longitude
                </div>
                <p className="font-mono text-sm">{currentLocation.longitude.toFixed(6)}</p>
              </div>
              {currentLocation.speed !== undefined && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Gauge className="h-4 w-4" />
                    Velocidade
                  </div>
                  <p className="font-mono text-sm">{(currentLocation.speed * 3.6).toFixed(1)} km/h</p>
                </div>
              )}
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Atualizado
                </div>
                <p className="font-mono text-sm">
                  {format(new Date(currentLocation.created_at), "HH:mm:ss", { locale: ptBR })}
                </p>
              </div>
            </div>

            {/* Map Token Input */}
            {!showMap && (
              <div className="space-y-2">
                <Label htmlFor="mapbox-token">Token Mapbox (opcional para visualizar mapa)</Label>
                <div className="flex gap-2">
                  <Input
                    id="mapbox-token"
                    type="password"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                  <Button onClick={() => setShowMap(true)} disabled={!mapboxToken}>
                    Ver Mapa
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obtenha seu token em mapbox.com/account/access-tokens
                </p>
              </div>
            )}

            {/* Map Display */}
            {showMap && mapUrl && (
              <div className="relative">
                <img
                  src={mapUrl}
                  alt="Localização atual"
                  className="w-full rounded-lg border"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setShowMap(false)}
                >
                  Fechar Mapa
                </Button>
              </div>
            )}

            {/* Location History */}
            {locationHistory.length > 1 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Histórico de Localizações ({locationHistory.length} pontos)
                </h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {locationHistory.slice(-10).reverse().map((loc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                    >
                      <span className="font-mono">
                        {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(loc.created_at), "HH:mm:ss", { locale: ptBR })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mb-2" />
            <p>Nenhuma localização disponível</p>
            <p className="text-sm">
              {isTransporter
                ? "Clique em 'Iniciar Rastreamento' para começar"
                : "Aguardando o transportador iniciar o rastreamento"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
