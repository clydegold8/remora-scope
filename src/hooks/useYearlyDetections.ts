import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLoading } from "@/contexts/LoadingContext";

export interface DetectionData {
  id: string;
  remora_id: number;
  people_count: number;
  car_count: number;
  created_at: string;
  timestamp?: number;
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

export interface YearlyStats {
  year: number;
  totalDetections: number;
  totalPeople: number;
  totalCars: number;
  activeSensors: number;
  highestPeopleCount: { count: number; month: string };
  highestCarsCount: { count: number; month: string };
}

export function useYearlyDetections(selectedYear: number) {
  const [detections, setDetections] = useState<DetectionData[]>([]);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats | null>(null);
  const { setLoading } = useLoading('yearly-detections');

  const fetchYearlyDetections = async (year: number) => {
    setLoading(true);
    try {
      // Calculate year boundaries as timestamps
      const yearStart = new Date(`${year}-01-01T00:00:00Z`).getTime() / 1000;
      const yearEnd = new Date(`${year + 1}-01-01T00:00:00Z`).getTime() / 1000;

      const { data, error } = await supabase
        .from("detection_details")
        .select("*")
        .gte("timestamp", yearStart)
        .lt("timestamp", yearEnd)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error fetching yearly detections:", error);
        setDetections([]);
        setYearlyStats(null);
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

      setDetections(transformedData);
      
      // Calculate yearly statistics
      if (transformedData.length > 0) {
        const totalPeople = transformedData.reduce((sum, d) => sum + d.people_count, 0);
        const totalCars = transformedData.reduce((sum, d) => sum + d.car_count, 0);
        const activeSensors = new Set(transformedData.map(d => d.remora_id)).size;

        // Calculate monthly stats for highest counts
        const monthlyStats: Record<string, { people: number; cars: number }> = {};
        
        transformedData.forEach(detection => {
          if (detection.timestamp) {
            const date = new Date(detection.timestamp * 1000);
            const monthKey = date.toLocaleString('default', { month: 'long' });
            
            if (!monthlyStats[monthKey]) {
              monthlyStats[monthKey] = { people: 0, cars: 0 };
            }
            
            monthlyStats[monthKey].people += detection.people_count;
            monthlyStats[monthKey].cars += detection.car_count;
          }
        });

        const monthsWithStats = Object.entries(monthlyStats);
        const highestPeopleMonth = monthsWithStats.reduce((max, [month, stats]) => 
          stats.people > max.count ? { count: stats.people, month } : max, 
          { count: 0, month: 'N/A' }
        );
        
        const highestCarsMonth = monthsWithStats.reduce((max, [month, stats]) => 
          stats.cars > max.count ? { count: stats.cars, month } : max, 
          { count: 0, month: 'N/A' }
        );

        setYearlyStats({
          year,
          totalDetections: transformedData.length,
          totalPeople,
          totalCars,
          activeSensors,
          highestPeopleCount: highestPeopleMonth,
          highestCarsCount: highestCarsMonth,
        });
      } else {
        setYearlyStats({
          year,
          totalDetections: 0,
          totalPeople: 0,
          totalCars: 0,
          activeSensors: 0,
          highestPeopleCount: { count: 0, month: 'N/A' },
          highestCarsCount: { count: 0, month: 'N/A' },
        });
      }
    } catch (error) {
      console.error("Error fetching yearly detections:", error);
      setDetections([]);
      setYearlyStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearlyDetections(selectedYear);
  }, [selectedYear]);

  return {
    detections,
    yearlyStats,
    refetch: () => fetchYearlyDetections(selectedYear),
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