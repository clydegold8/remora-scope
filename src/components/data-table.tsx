import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Users, Car, Activity } from "lucide-react"

import { DetectionData } from "@/hooks/useDetections"

interface DataTableProps {
  data: DetectionData[]
  isLoading?: boolean
}

export function DataTable({ data, isLoading = false }: DataTableProps) {
  // Remove delete functionality as requested

  const formatLocation = (lat?: number, lng?: number) => {
    if (!lat || !lng) return "N/A"
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }

  const getTotalDetections = (peopleCount: number, carCount: number) => {
    return peopleCount + carCount
  }

  if (data.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Detection History</span>
          </CardTitle>
          <CardDescription>Recent sensor detection records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No detections recorded yet</p>
              <p className="text-sm">Sensor data will appear here when available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Detection History</span>
          </div>
          <Badge variant="secondary" className="animate-slide-in">
            {data.length} record{data.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
        <CardDescription>
          Recent sensor detection records from your urban traffic monitoring network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Detected</span>
                  </div>
                </TableHead>
                <TableHead>Sensor ID</TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>People</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Car className="h-4 w-4" />
                    <span>Cars</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location</span>
                  </div>
                </TableHead>
                <TableHead>Altitude</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((record) => (
                <TableRow 
                  key={record.id} 
                  className="hover:bg-muted/50 transition-colors duration-200"
                >
                  <TableCell className="font-medium">
                    <div className="text-sm">
                      {new Date(record.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(record.created_at).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      #{record.remora_id}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={record.people_count > 0 ? "default" : "secondary"}
                        className="w-8 h-6 justify-center"
                      >
                        {record.people_count}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={record.car_count > 0 ? "default" : "secondary"}
                        className="w-8 h-6 justify-center"
                      >
                        {record.car_count}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">
                      {formatLocation(record.latitude, record.longitude)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {record.altitude ? `${record.altitude.toFixed(1)}m` : "N/A"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}