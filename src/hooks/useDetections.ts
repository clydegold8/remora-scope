import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface DetectionData {
  id: string
  remora_id: number
  people_count: number
  car_count: number
  latitude?: number
  longitude?: number
  altitude?: number
  created_at: string
}

export const useDetections = () => {
  const [detections, setDetections] = useState<DetectionData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchDetections = async () => {
    try {
      setIsLoading(true)
      
      // Fetch from the detection_details view which joins detection_info and gps_fix
      const { data, error } = await supabase
        .from("detection_details")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching detections:", error)
        toast({
          title: "Error",
          description: "Failed to load detection data. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Transform the data to match our interface
      const transformedData: DetectionData[] = data?.map((item: any) => ({
        id: String(item.id || item.gps_fix_id || Date.now()),
        remora_id: item.remora_id || 0,
        people_count: item.people_count || 0,
        car_count: item.car_count || 0,
        latitude: item.location ? parseLocationToLat(item.location) : undefined,
        longitude: item.location ? parseLocationToLng(item.location) : undefined,
        altitude: item.altitude || undefined,
        created_at: item.created_at || new Date().toISOString(),
      })) || []

      setDetections(transformedData)
    } catch (error) {
      console.error("Error fetching detections:", error)
      toast({
        title: "Error",
        description: "Failed to load detection data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to parse PostGIS point to latitude
  const parseLocationToLat = (location: any): number | undefined => {
    if (!location) return undefined
    try {
      // Handle different possible formats of PostGIS point data
      if (typeof location === 'string') {
        const match = location.match(/POINT\(([^)]+)\)/)
        if (match) {
          const [lng, lat] = match[1].split(' ').map(Number)
          return lat
        }
      }
      // Handle if it's already parsed as an object
      if (location.coordinates && Array.isArray(location.coordinates)) {
        return location.coordinates[1] // GeoJSON format [lng, lat]
      }
    } catch (error) {
      console.error("Error parsing location to lat:", error)
    }
    return undefined
  }

  // Helper function to parse PostGIS point to longitude
  const parseLocationToLng = (location: any): number | undefined => {
    if (!location) return undefined
    try {
      // Handle different possible formats of PostGIS point data
      if (typeof location === 'string') {
        const match = location.match(/POINT\(([^)]+)\)/)
        if (match) {
          const [lng, lat] = match[1].split(' ').map(Number)
          return lng
        }
      }
      // Handle if it's already parsed as an object
      if (location.coordinates && Array.isArray(location.coordinates)) {
        return location.coordinates[0] // GeoJSON format [lng, lat]
      }
    } catch (error) {
      console.error("Error parsing location to lng:", error)
    }
    return undefined
  }

  useEffect(() => {
    fetchDetections()
  }, [])

  return {
    detections,
    isLoading,
    refetch: fetchDetections,
  }
}