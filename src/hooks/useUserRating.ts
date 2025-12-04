import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserRating {
  averageRating: number;
  totalRatings: number;
}

export const useUserRating = (userId: string | null) => {
  const [rating, setRating] = useState<UserRating>({ averageRating: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("ratings" as any)
          .select("rating")
          .eq("reviewed_id", userId);

        if (error) throw error;

        if (data && data.length > 0) {
          const total = (data as any[]).reduce((acc, r) => acc + r.rating, 0);
          setRating({
            averageRating: total / data.length,
            totalRatings: data.length,
          });
        }
      } catch (error) {
        console.error("Error fetching rating:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRating();
  }, [userId]);

  return { ...rating, loading };
};
