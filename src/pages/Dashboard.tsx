import { LocationData } from "@/components/world-map"
import { DashboardHeader } from "@/components/dashboard-header"
import { DataTable } from "@/components/data-table"
import { DetectionChart } from "@/components/charts/detection-chart"
import { WorldMap } from "@/components/world-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Activity } from "lucide-react"
import { useDetections } from "@/hooks/useDetections"

export default function Dashboard() {
  const { detections, isLoading } = useDetections()

  const totalDetections = detections.length
  const totalPeople = detections.reduce((sum, d) => sum + d.people_count, 0)
  const totalCars = detections.reduce((sum, d) => sum + d.car_count, 0)
  const activeSensors = new Set(detections.map(d => d.remora_id)).size

  const validLocationData = detections.filter(d => d.latitude && d.longitude).map(d => ({
    ...d,
    // Ensure compatibility with LocationData interface
    latitude: d.latitude!,
    longitude: d.longitude!,
  })) as LocationData[]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalDetections}</p>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-accent/10">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeSensors}</p>
                  <p className="text-sm text-muted-foreground">Active Sensors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-success/10">
                  <Activity className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalPeople}</p>
                  <p className="text-sm text-muted-foreground">People Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-scale">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-warning/10">
                  <Activity className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalCars}</p>
                  <p className="text-sm text-muted-foreground">Cars Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <DetectionChart data={detections} />
          <WorldMap data={validLocationData} />
        </div>

        {/* Data Table */}
        <DataTable 
          data={detections} 
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}