import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface City {
  name: string;
  lat: number;
  lng: number;
  province: string;
}

interface MozambiqueMapProps {
  cities: City[];
  origin?: string;
  destination?: string;
  onCitySelect?: (city: string, type: "origin" | "destination") => void;
}

const MozambiqueMap = ({ cities, origin, destination, onCitySelect }: MozambiqueMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"origin" | "destination" | null>(null);

  useEffect(() => {
    if (!showMap || !mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [35.5, -18.5], // Center of Mozambique
      zoom: 5,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    // Add markers for cities
    cities.forEach((city) => {
      const el = document.createElement("div");
      el.className = "city-marker";
      
      const isOrigin = city.name === origin;
      const isDestination = city.name === destination;
      
      el.style.cssText = `
        width: ${isOrigin || isDestination ? "24px" : "16px"};
        height: ${isOrigin || isDestination ? "24px" : "16px"};
        background: ${isOrigin ? "#22c55e" : isDestination ? "#ef4444" : "#3b82f6"};
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
      `;
      
      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.3)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });
      
      el.addEventListener("click", () => {
        if (selectionMode && onCitySelect) {
          onCitySelect(city.name, selectionMode);
        }
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; font-family: system-ui;">
          <strong style="font-size: 14px;">${city.name}</strong>
          <p style="margin: 4px 0 0; font-size: 12px; color: #666;">${city.province}</p>
          ${isOrigin ? '<span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: #22c55e; color: white; border-radius: 4px; font-size: 11px;">Origem</span>' : ""}
          ${isDestination ? '<span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: #ef4444; color: white; border-radius: 4px; font-size: 11px;">Destino</span>' : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([city.lng, city.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Draw line between origin and destination
    if (origin && destination) {
      const originCity = cities.find((c) => c.name === origin);
      const destCity = cities.find((c) => c.name === destination);
      
      if (originCity && destCity) {
        map.current.on("load", () => {
          map.current?.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: [
                  [originCity.lng, originCity.lat],
                  [destCity.lng, destCity.lat],
                ],
              },
            },
          });

          map.current?.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 3,
              "line-dasharray": [2, 2],
            },
          });

          // Fit bounds to show both cities
          const bounds = new mapboxgl.LngLatBounds()
            .extend([originCity.lng, originCity.lat])
            .extend([destCity.lng, destCity.lat]);
          
          map.current?.fitBounds(bounds, { padding: 80 });
        });
      }
    }

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [showMap, mapboxToken, cities, origin, destination, selectionMode, onCitySelect]);

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Mapa de Rotas - Moçambique
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showMap ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para visualizar o mapa interativo, insira seu token público do Mapbox.
              Obtenha um gratuitamente em{" "}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
            <div className="space-y-2">
              <Label htmlFor="mapbox-token">Token Público Mapbox</Label>
              <Input
                id="mapbox-token"
                type="text"
                placeholder="pk.xxx..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowMap(true)}
              disabled={!mapboxToken}
              className="w-full bg-gradient-primary"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Carregar Mapa
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {onCitySelect && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectionMode === "origin" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectionMode(selectionMode === "origin" ? null : "origin")}
                >
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                  Selecionar Origem
                </Button>
                <Button
                  variant={selectionMode === "destination" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectionMode(selectionMode === "destination" ? null : "destination")}
                >
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                  Selecionar Destino
                </Button>
              </div>
            )}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Origem
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" /> Destino
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500" /> Cidade
              </span>
            </div>
            <div
              ref={mapContainer}
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg overflow-hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MozambiqueMap;
