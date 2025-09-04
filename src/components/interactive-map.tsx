import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { DetectionData } from "@/hooks/useYearlyDetections";
import { WorldMap } from "./world-map";
import { LoadingOverlay } from "./ui/loading-spinner";

interface InteractiveMapProps {
  data: DetectionData[];
  isLoading: boolean;
}

export function InteractiveMap({
  data,
  isLoading = false,
}: InteractiveMapProps) {
  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Interactive Detection Map</span>
        </CardTitle>
        <CardDescription>
          Geographical visualization of sensor detection data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingOverlay isLoading>
          <WorldMap detections={data} />
        </LoadingOverlay>
      </CardContent>
    </Card>
  );
}
