import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";
import { LoadingOverlay } from "./ui/loading-spinner";
import { useLoading } from "@/contexts/LoadingContext";
import type { DetectionData } from "@/hooks/useYearlyDetections";

interface InteractiveMapProps {
  data: DetectionData[];
}

export function InteractiveMap({ data }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const { isLoading } = useLoading('yearly-detections');

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: { name: 'globe' } as any,
        zoom: 1.5,
        center: [30, 15],
        pitch: 45,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.scrollZoom.disable();

      map.current.on('style.load', () => {
        if (map.current) {
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
        }
      });

      // Add rotation animation
      const secondsPerRevolution = 240;
      const maxSpinZoom = 5;
      const slowSpinZoom = 3;
      let userInteracting = false;
      let spinEnabled = true;

      function spinGlobe() {
        if (!map.current) return;
        
        const zoom = map.current.getZoom();
        if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
          let distancePerSecond = 360 / secondsPerRevolution;
          if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
          }
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('dragstart', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
      map.current.on('touchend', () => { userInteracting = false; spinGlobe(); });
      map.current.on('moveend', () => { spinGlobe(); });

      spinGlobe();
      setIsMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  // Add markers for detection data
  useEffect(() => {
    if (!map.current || !isMapInitialized || isLoading) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add new markers
    const validLocations = data.filter(d => d.latitude && d.longitude);
    
    validLocations.forEach(detection => {
      if (!detection.latitude || !detection.longitude) return;

      const el = document.createElement('div');
      el.className = 'detection-marker';
      el.style.backgroundColor = '#hsl(var(--primary))';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h4 class="font-bold">Sensor ${detection.remora_id}</h4>
          <p>People: ${detection.people_count}</p>
          <p>Cars: ${detection.car_count}</p>
          <p>Altitude: ${detection.altitude?.toFixed(1)}m</p>
        </div>
      `);

      new mapboxgl.Marker(el)
        .setLngLat([detection.longitude, detection.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  }, [data, isMapInitialized, isLoading]);

  useEffect(() => {
    return () => {
      map.current?.remove();
    };
  }, []);

  if (!mapboxToken) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Interactive Detection Map</span>
          </CardTitle>
          <CardDescription>
            Enter your Mapbox public token to view detections on an interactive map
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Mapbox public token..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={initializeMap}>
              <Settings className="h-4 w-4 mr-2" />
              Initialize Map
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get your token at{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Interactive Detection Map</span>
        </CardTitle>
        <CardDescription>
          Global visualization of sensor detection data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoadingOverlay isLoading={isLoading}>
          <div className="relative w-full h-96">
            <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
          </div>
        </LoadingOverlay>
      </CardContent>
    </Card>
  );
}