import { useState } from "react"
import { LocationData } from "@/components/world-map"
import { DashboardHeader } from "@/components/dashboard-header"
import { SensorForm } from "@/components/sensor-form"
import { DataTable } from "@/components/data-table"
import { DetectionChart } from "@/components/charts/detection-chart"
import { WorldMap } from "@/components/world-map"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Database, TrendingUp, Globe, Activity } from "lucide-react"

interface SensorDetection {
  id: string
  remora_id: number
  people_count: number
  car_count: number
  latitude?: number
  longitude?: number
  altitude?: number
  created_at: string
}

// Mock data for demonstration - this would be replaced with Supabase integration
const mockData: SensorDetection[] = [
  {
    id: "1",
    remora_id: 1,
    people_count: 3,
    car_count: 1,
    latitude: 9.3077,
    longitude: 123.3054,
    altitude: 50.5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "2", 
    remora_id: 2,
    people_count: 5,
    car_count: 2,
    latitude: 14.5995,
    longitude: 120.9842,
    altitude: 25.0,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "3",
    remora_id: 1,
    people_count: 2,
    car_count: 0,
    latitude: 9.3100,
    longitude: 123.3100,
    altitude: 48.2,
    created_at: new Date().toISOString(),
  },
]

export default function Dashboard() {
  const [detections, setDetections] = useState<SensorDetection[]>(mockData)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddDetection = async (data: any) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newDetection: SensorDetection = {
      id: Date.now().toString(),
      remora_id: data.remoraId,
      people_count: data.peopleCount,
      car_count: data.carCount,
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      created_at: new Date().toISOString(),
    }
    
    setDetections([newDetection, ...detections])
  }

  const handleDeleteDetection = async (id: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setDetections(detections.filter(d => d.id !== id))
  }

  const totalDetections = detections.length
  const totalPeople = detections.reduce((sum, d) => sum + d.people_count, 0)
  const totalCars = detections.reduce((sum, d) => sum + d.car_count, 0)
  const activeSensors = new Set(detections.map(d => d.remora_id)).size

  const validLocationData = detections.filter(d => d.latitude && d.longitude) as LocationData[]

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Supabase Integration Alert */}
        <Alert className="border-warning bg-warning/10 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning-foreground">
            <strong>Database Integration Required:</strong> Connect to Supabase using the green button in the top right to enable data persistence and real-time functionality.
          </AlertDescription>
        </Alert>

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

        {/* Add Detection Form */}
        <SensorForm onSubmit={handleAddDetection} isLoading={isLoading} />

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <DetectionChart data={detections} />
          <WorldMap data={validLocationData} />
        </div>

        {/* Data Table */}
        <DataTable 
          data={detections} 
          onDelete={handleDeleteDetection}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}