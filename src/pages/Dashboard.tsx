import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DataTable } from "@/components/data-table";
import { DetectionChart } from "@/components/charts/detection-chart";
import { InteractiveMap } from "@/components/interactive-map";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import {
  Database,
  Activity,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Car,
} from "lucide-react";
import { useYearlyDetections } from "@/hooks/useYearlyDetections";
import { useInfiniteDetections } from "@/hooks/useInfiniteDetections";
import { useLoading } from "@/contexts/LoadingContext";
import { WorldMap } from "@/components/world-map";

export default function Dashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { detections, yearlyStats, aggMonthStats } =
    useYearlyDetections(selectedYear);
  const {
    detections: infiniteDetections,
    loadMore,
    fetchDetections,
  } = useInfiniteDetections(selectedYear);
  const { isLoading } = useLoading("yearly-detections");

  useEffect(() => {
    fetchDetections(0, true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Year Selection */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Detection Analytics</h2>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Yearly Stats Overview */}
        <LoadingOverlay isLoading={isLoading}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {yearlyStats?.totalDetections || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Records
                    </p>
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
                    <p className="text-2xl font-bold">
                      {yearlyStats?.activeSensors || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Sensors
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-success/10">
                    <Users className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.totalPeople || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total People Detected ({selectedYear.toString()})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-success/10">
                    <Car className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.totalCars || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Cars Detected ({selectedYear.toString()})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-success/10">
                    <TrendingUp className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.highestPeopleCount.count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Peak People (
                      {yearlyStats?.highestPeopleCount.month || "N/A"})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-warning/10">
                    <TrendingUp className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.highestCarsCount.count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Peak Cars ({yearlyStats?.highestCarsCount.month || "N/A"})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-success/10">
                    <TrendingDown className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.lowestPeopleCount.count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lowest People (
                      {yearlyStats?.lowestPeopleCount.month || "N/A"})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-warning/10">
                    <TrendingDown className="h-4 w-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">
                      {yearlyStats?.lowestCarsCount.count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lowest Cars ({yearlyStats?.lowestCarsCount.month || "N/A"}
                      )
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </LoadingOverlay>

        {/* Charts and Map Grid */}
        <div className="grid grid-cols-1 gap-8">
          <DetectionChart aggMonthStats={aggMonthStats} data={detections} />
          <InteractiveMap isLoading={isLoading} data={detections} />
        </div>

        {/* Data Table */}
        <DataTable data={infiniteDetections} onLoadMore={loadMore} />
      </main>
    </div>
  );
}
