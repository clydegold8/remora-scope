import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useEffect, useRef } from "react";
import { Database } from "lucide-react";
import type { DetectionData } from "@/hooks/useYearlyDetections";

interface DataTableProps {
  data: DetectionData[];
  hasMore: boolean;
  onLoadMore: () => void;
  isLoading?: boolean;
}

export function DataTable({ data, hasMore, onLoadMore, isLoading = false }: DataTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const formatLocation = (latitude?: number, longitude?: number) => {
    if (!latitude || !longitude) return "No GPS data";
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  };

  const getTotalDetections = (peopleCount: number, carCount: number) => {
    return peopleCount + carCount;
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;
      if (!container || isLoading || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onLoadMore();
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading, hasMore, onLoadMore]);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-primary" />
          <span>Detection History</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {data.length === 0 && !isLoading ? (
          <div className="flex items-center justify-center py-8 px-6">
            <div className="text-center">
              <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No detections recorded yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Detection data will appear here as sensors report activity
              </p>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="max-h-96 overflow-y-auto overflow-x-auto border-t"
          >
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Detected Time</TableHead>
                  <TableHead>Sensor ID</TableHead>
                  <TableHead>People</TableHead>
                  <TableHead>Cars</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Altitude</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((detection) => (
                  <TableRow key={detection.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-mono text-sm">
                      {detection.created_at 
                        ? new Date(detection.created_at).toLocaleString()
                        : detection.timestamp 
                        ? new Date(detection.timestamp * 1000).toLocaleString()
                        : "Unknown"
                      }
                    </TableCell>
                    <TableCell className="font-semibold">
                      {detection.remora_id}
                    </TableCell>
                    <TableCell className="text-primary font-medium">
                      {detection.people_count}
                    </TableCell>
                    <TableCell className="text-accent font-medium">
                      {detection.car_count}
                    </TableCell>
                    <TableCell className="font-bold">
                      {getTotalDetections(detection.people_count, detection.car_count)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatLocation(detection.latitude, detection.longitude)}
                    </TableCell>
                    <TableCell>
                      {detection.altitude ? `${detection.altitude.toFixed(1)}m` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      <LoadingSpinner size="sm" className="mx-auto" />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}