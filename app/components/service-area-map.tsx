"use client";

import { useEffect, useState } from "react";
import Map, { Layer, NavigationControl, Source } from "react-map-gl/maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { SERVICE_RADIUS_MILES, serviceTowns } from "./service-area-data";

// Free, keyless vector tiles. Recoloured below to match the brand.
const BASE_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

// Served from public/ (see scripts/copy-maplibre-worker.mjs); the bundler can't emit MapLibre's worker.
const mapLib =
  typeof window === "undefined"
    ? undefined
    : import("maplibre-gl").then((maplibre) => {
        maplibre.setWorkerUrl("/maplibre-gl-worker.mjs");
        return maplibre;
      });

// MapLibre paint properties can't read CSS variables, so the brand colours are repeated here.
const colors = {
  navy: "#012659",
  orange: "#f9a23b",
  land: "#f4fafd",
  green: "#e2f0f5",
  residential: "#edf5f9",
  water: "#bfdcee",
  waterway: "#a9d0e8",
  building: "#e6f0f5",
  roadCasing: "#d2e3ee",
  roadMinor: "#e3eef4",
  boundary: "#9db8cc",
};

// Base layer id → [paint property, colour]. Layers not listed keep the base style's colour.
const layerColors: Record<string, [string, string]> = {
  background: ["background-color", colors.land],
  park: ["fill-color", colors.green],
  landcover_wood: ["fill-color", colors.green],
  landuse_residential: ["fill-color", colors.residential],
  water: ["fill-color", colors.water],
  waterway: ["line-color", colors.waterway],
  building: ["fill-color", colors.building],
  highway_minor: ["line-color", colors.roadMinor],
  highway_major_casing: ["line-color", colors.roadCasing],
  highway_major_inner: ["line-color", "#ffffff"],
  highway_motorway_casing: ["line-color", colors.roadCasing],
  highway_motorway_inner: ["line-color", "#ffffff"],
  boundary_2: ["line-color", colors.boundary],
  boundary_3: ["line-color", colors.boundary],
};

function themeStyle(style: StyleSpecification): StyleSpecification {
  return {
    ...style,
    layers: style.layers.map((layer) => {
      // Our own city labels replace the base map's text and road shields.
      if (layer.type === "symbol") {
        return { ...layer, layout: { ...layer.layout, visibility: "none" } };
      }
      const override = layerColors[layer.id];
      if (!override) return layer;
      const [property, color] = override;
      return { ...layer, paint: { ...layer.paint, [property]: color } } as typeof layer;
    }),
  };
}

const HQ = serviceTowns[0].coordinates;

const cityPoints: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: "FeatureCollection",
  features: serviceTowns.map((town, i) => ({
    type: "Feature",
    properties: { name: town.name, hq: i === 0 },
    geometry: { type: "Point", coordinates: town.coordinates },
  })),
};

function circle(
  [lng, lat]: [number, number],
  miles: number,
  steps = 96
): GeoJSON.Feature<GeoJSON.Polygon> {
  const dLat = miles / 69;
  const dLng = miles / (69 * Math.cos((lat * Math.PI) / 180));
  const ring: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [ring] } };
}

const serviceArea = circle(HQ, SERVICE_RADIUS_MILES);

export function ServiceAreaMap() {
  const [mapStyle, setMapStyle] = useState<StyleSpecification | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(BASE_STYLE_URL)
      .then((res) => res.json())
      .then((style: StyleSpecification) => {
        if (!cancelled) setMapStyle(themeStyle(style));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!mapStyle) return <div className="size-full animate-pulse bg-white/60" />;

  return (
    <Map
      mapLib={mapLib}
      mapStyle={mapStyle}
      initialViewState={{
        bounds: [
          [-95.62, 31.9],
          [-94.68, 32.6],
        ],
        fitBoundsOptions: { padding: 32 },
      }}
      scrollZoom={false}
      dragRotate={false}
      touchPitch={false}
      attributionControl={{ compact: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" showCompass={false} />

      <Source id="service-area" type="geojson" data={serviceArea}>
        <Layer
          id="service-area-fill"
          type="fill"
          paint={{ "fill-color": colors.orange, "fill-opacity": 0.12 }}
        />
        <Layer
          id="service-area-outline"
          type="line"
          paint={{ "line-color": colors.orange, "line-width": 2, "line-dasharray": [2, 1.5] }}
        />
      </Source>

      <Source id="cities" type="geojson" data={cityPoints}>
        <Layer
          id="city-dots"
          type="circle"
          paint={{
            "circle-radius": ["case", ["get", "hq"], 8, 5],
            "circle-color": ["case", ["get", "hq"], colors.orange, colors.navy],
            "circle-stroke-color": "#ffffff",
            "circle-stroke-width": 2,
          }}
        />
        <Layer
          id="city-labels"
          type="symbol"
          layout={{
            "text-field": ["get", "name"],
            "text-font": ["Noto Sans Bold"],
            "text-size": ["case", ["get", "hq"], 15, 13],
            // Try above first, then other sides, so crowded towns still get a label.
            "text-variable-anchor": ["bottom", "left", "right", "top"],
            "text-radial-offset": 0.7,
          }}
          paint={{
            "text-color": colors.navy,
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5,
          }}
        />
      </Source>
    </Map>
  );
}
