import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Globe } from "lucide-react"

export interface LocationData {
  id: string
  remora_id: number
  people_count: number
  car_count: number
  latitude?: number
  longitude?: number
  altitude?: number
  created_at: string
}

interface WorldMapProps {
  data: LocationData[]
}

export function WorldMap({ data }: WorldMapProps) {
  // Filter data to only include items with valid coordinates
  const validLocationData = data.filter(item => 
    item.latitude !== null && 
    item.longitude !== null && 
    item.latitude !== undefined &&
    item.longitude !== undefined &&
    !isNaN(item.latitude) && 
    !isNaN(item.longitude)
  )

  if (validLocationData.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Global Detection Map</span>
          </CardTitle>
          <CardDescription>Geographic distribution of sensor detections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80 text-muted-foreground">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No location data available</p>
              <p className="text-sm">Add detections with coordinates to see them on the map</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-primary" />
          <span>Global Detection Map</span>
        </CardTitle>
        <CardDescription>
          Geographic distribution of {validLocationData.length} sensor detection{validLocationData.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg">
            <Globe className="h-16 w-16 mx-auto mb-4 text-primary opacity-50" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Interactive Map Coming Soon
            </p>
            <p className="text-sm text-muted-foreground">
              Map visualization will be available once Supabase is connected
            </p>
          </div>
          
          {/* Location List */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground mb-3">
              Recorded Locations ({validLocationData.length})
            </h4>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {validLocationData.map((location) => (
                <div 
                  key={location.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <MapPin className="h-3 w-3 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        Sensor #{location.remora_id}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
                        {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {location.people_count + location.car_count} detections
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {location.altitude && `${location.altitude.toFixed(1)}m`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}