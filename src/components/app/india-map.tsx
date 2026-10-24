import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Tooltip, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CITY_COORDS } from "@/lib/cities";

export type MapShipment = { id: string; pickup: string; destination: string; status: string; driver: string | null; vehicle: string | null; eta: string | null };

export default function IndiaMap({ shipments, selected, onSelect }: { shipments: MapShipment[]; selected: string | null; onSelect: (id: string) => void }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setT((v) => (v + 0.005) % 1), 100);
    return () => clearInterval(iv);
  }, []);

  return (
    <MapContainer center={[22.5, 79]} zoom={5} minZoom={4} maxBounds={[[5, 65], [38, 99]]} scrollWheelZoom className="h-[520px] w-full rounded-lg">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Object.entries(CITY_COORDS).map(([name, pos]) => (
        <CircleMarker key={name} center={pos} radius={6} pathOptions={{ color: "#1d4ed8", fillColor: "#3b82f6", fillOpacity: 0.9, weight: 2 }}>
          <Tooltip direction="top" offset={[0, -6]}>{name}</Tooltip>
        </CircleMarker>
      ))}
      {shipments.map((s, idx) => {
        const a = CITY_COORDS[s.pickup], b = CITY_COORDS[s.destination];
        if (!a || !b) return null;
        const delayed = s.status === "Delayed";
        const color = delayed ? "#f59e0b" : "#16a34a";
        const dim = selected && selected !== s.id;
        const p = (t + idx * 0.17) % 1;
        const pos: [number, number] = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
        return (
          <div key={s.id}>
            <Polyline positions={[a, b]} pathOptions={{ color, weight: selected === s.id ? 5 : 3, dashArray: "8 6", opacity: dim ? 0.25 : 0.9 }} eventHandlers={{ click: () => onSelect(s.id) }} />
            <CircleMarker center={pos} radius={selected === s.id ? 9 : 7} pathOptions={{ color: "#ffffff", fillColor: color, fillOpacity: 1, weight: 3, opacity: dim ? 0.3 : 1 }} eventHandlers={{ click: () => onSelect(s.id) }}>
              <Popup>
                <strong>{s.id}</strong> · {s.status}<br />
                {s.pickup} → {s.destination}<br />
                {s.driver ?? "—"} · {s.vehicle ?? "—"}<br />
                ETA {s.eta ?? "—"}
              </Popup>
            </CircleMarker>
          </div>
        );
      })}
    </MapContainer>
  );
}
