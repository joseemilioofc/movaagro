import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Location {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  created_at: string;
}

interface UseGPSTrackingProps {
  transportRequestId: string;
  transporterId?: string;
  isTransporter: boolean;
}

export const useGPSTracking = ({ transportRequestId, transporterId, isTransporter }: UseGPSTrackingProps) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch location history
  const fetchLocationHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from("transport_locations")
      .select("latitude, longitude, speed, heading, accuracy, created_at")
      .eq("transport_request_id", transportRequestId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching location history:", error);
      return;
    }

    if (data) {
      setLocationHistory(data.map(loc => ({
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        speed: loc.speed ? Number(loc.speed) : undefined,
        heading: loc.heading ? Number(loc.heading) : undefined,
        accuracy: loc.accuracy ? Number(loc.accuracy) : undefined,
        created_at: loc.created_at
      })));
      
      if (data.length > 0) {
        const latest = data[data.length - 1];
        setCurrentLocation({
          latitude: Number(latest.latitude),
          longitude: Number(latest.longitude),
          speed: latest.speed ? Number(latest.speed) : undefined,
          heading: latest.heading ? Number(latest.heading) : undefined,
          accuracy: latest.accuracy ? Number(latest.accuracy) : undefined,
          created_at: latest.created_at
        });
      }
    }
  }, [transportRequestId]);

  // Subscribe to realtime updates
  useEffect(() => {
    fetchLocationHistory();

    const channel = supabase
      .channel(`location-${transportRequestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transport_locations",
          filter: `transport_request_id=eq.${transportRequestId}`,
        },
        (payload) => {
          const newLocation = payload.new as any;
          const location: Location = {
            latitude: Number(newLocation.latitude),
            longitude: Number(newLocation.longitude),
            speed: newLocation.speed ? Number(newLocation.speed) : undefined,
            heading: newLocation.heading ? Number(newLocation.heading) : undefined,
            accuracy: newLocation.accuracy ? Number(newLocation.accuracy) : undefined,
            created_at: newLocation.created_at
          };
          setCurrentLocation(location);
          setLocationHistory(prev => [...prev, location]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [transportRequestId, fetchLocationHistory]);

  // Start tracking (for transporters)
  const startTracking = useCallback(async () => {
    if (!isTransporter || !transporterId) return;

    if (!navigator.geolocation) {
      toast({
        title: "Erro",
        description: "Geolocalização não suportada pelo navegador",
        variant: "destructive",
      });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed, heading, accuracy } = position.coords;
        
        const { error } = await supabase.from("transport_locations").insert({
          transport_request_id: transportRequestId,
          transporter_id: transporterId,
          latitude,
          longitude,
          speed: speed || null,
          heading: heading || null,
          accuracy: accuracy || null,
        });

        if (error) {
          console.error("Error saving location:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Erro de GPS",
          description: error.message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    setWatchId(id);
    setIsTracking(true);
    toast({
      title: "Rastreamento iniciado",
      description: "Sua localização está sendo compartilhada",
    });
  }, [isTransporter, transporterId, transportRequestId, toast]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      toast({
        title: "Rastreamento parado",
        description: "Sua localização não está mais sendo compartilhada",
      });
    }
  }, [watchId, toast]);

  return {
    currentLocation,
    locationHistory,
    isTracking,
    startTracking,
    stopTracking,
    fetchLocationHistory,
  };
};
