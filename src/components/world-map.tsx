import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { DetectionData } from "@/hooks/useYearlyDetections";

// Component to auto-fit map to all coordinates
const FitBounds = ({ locations }: { locations: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
};

// Heatmap layer
const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;

    // Normalize intensity to 0–1 scale for heatmap
    const maxIntensity = Math.max(...points.map((p) => p[2]), 1);
    const normalizedPoints = points.map(([lat, lng, intensity]) => [
      lat,
      lng,
      Math.min(1, intensity / maxIntensity),
    ]) as [number, number, number][];

    const heatLayer = (L as any).heatLayer(normalizedPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      gradient: {
        0.1: "blue",
        0.3: "lime",
        0.6: "orange",
        0.9: "red",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
};

interface WorldMapProps {
  detections: DetectionData[];
  showMarkers?: boolean; // optional markers on top
}

export function WorldMap({ detections, showMarkers = true }: WorldMapProps) {
  // Filter valid coordinates
  const validDetections = detections.filter(
    (d) =>
      typeof d.latitude === "number" &&
      !isNaN(d.latitude) &&
      typeof d.longitude === "number" &&
      !isNaN(d.longitude)
  );

  const locations: [number, number][] = validDetections.map((d) => [
    d.latitude!,
    d.longitude!,
  ]);

  const heatPoints: [number, number, number][] = validDetections.map((d) => [
    d.latitude!,
    d.longitude!,
    d.people_count + d.car_count, // intensity
  ]);

  return (
    <MapContainer
      center={[12.8797, 121.774]} // default center on Philippines
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <HeatmapLayer points={heatPoints} />

      {showMarkers &&
        validDetections.map((d, i) => (
          <Marker key={i} position={[d.latitude!, d.longitude!]}>
            <Popup>
              <div>
                <strong>Sensor ID:</strong> {d.remora_id} <br />
                <strong>People:</strong> {d.people_count} <br />
                <strong>Cars:</strong> {d.car_count}
              </div>
            </Popup>
          </Marker>
        ))}

      <FitBounds locations={locations} />
    </MapContainer>
  );
}
