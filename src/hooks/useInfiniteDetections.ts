import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLoading } from "@/contexts/LoadingContext";
import type { DetectionData } from "./useYearlyDetections";

const ITEMS_PER_PAGE = 50;

export function useInfiniteDetections(selectedYear: number) {
  const [detections, setDetections] = useState<DetectionData[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const { setLoading } = useLoading('infinite-detections');

  const fetchDetections = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true);
    try {
      const yearStart = new Date(`${selectedYear}-01-01T00:00:00Z`).getTime() / 1000;
      const yearEnd = new Date(`${selectedYear + 1}-01-01T00:00:00Z`).getTime() / 1000;

      const { data, error } = await supabase
        .from("detection_details")
        .select("*")
        .gte("timestamp", yearStart)
        .lt("timestamp", yearEnd)
        .order("timestamp", { ascending: false })
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      if (error) {
        console.error("Error fetching detections:", error);
        return;
      }

      const transformedData: DetectionData[] = data.map((d) => ({
        id: d.id?.toString() || "",
        remora_id: d.remora_id || 0,
        people_count: d.people_count || 0,
        car_count: d.car_count || 0,
        created_at: d.created_at || "",
        timestamp: d.timestamp || undefined,
        latitude: d.location ? parseLocationToLat(d.location) : undefined,
        longitude: d.location ? parseLocationToLng(d.location) : undefined,
        altitude: d.altitude || undefined,
      }));

      setDetections(prev => reset ? transformedData : [...prev, ...transformedData]);
      setHasMore(transformedData.length === ITEMS_PER_PAGE);
      
      if (reset) {
        setPage(0);
      }
    } catch (error) {
      console.error("Error fetching detections:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedYear, setLoading]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchDetections(nextPage);
    }
  }, [page, hasMore, fetchDetections]);

  return {
    detections,
    loadMore,
    fetchDetections,
    refetch: () => fetchDetections(0, true),
  };
}

// Helper functions for location parsing
function parseLocationToLat(location: any): number | undefined {
  if (!location) return undefined;
  
  if (typeof location === "object" && location.coordinates) {
    return location.coordinates[1];
  }
  
  if (typeof location === "string") {
    const match = location.match(/POINT\(([^)]+)\)/);
    if (match) {
      const coords = match[1].split(" ");
      return coords.length === 2 ? parseFloat(coords[1]) : undefined;
    }
  }
  
  return undefined;
}

function parseLocationToLng(location: any): number | undefined {
  if (!location) return undefined;
  
  if (typeof location === "object" && location.coordinates) {
    return location.coordinates[0];
  }
  
  if (typeof location === "string") {
    const match = location.match(/POINT\(([^)]+)\)/);
    if (match) {
      const coords = match[1].split(" ");
      return coords.length === 2 ? parseFloat(coords[0]) : undefined;
    }
  }
  
  return undefined;
}