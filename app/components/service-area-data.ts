// Towns shown in the Service Area list and plotted on its map. The first entry is the home base.
export const serviceTowns: { name: string; coordinates: [lng: number, lat: number] }[] = [
  { name: "Tyler", coordinates: [-95.3011, 32.3513] },
  { name: "Whitehouse", coordinates: [-95.2255, 32.2268] },
  { name: "Lindale", coordinates: [-95.4094, 32.5157] },
  { name: "Flint", coordinates: [-95.3502, 32.2018] },
  { name: "Bullard", coordinates: [-95.3202, 32.1399] },
  { name: "Chandler", coordinates: [-95.4797, 32.3074] },
  { name: "Jacksonville", coordinates: [-95.2705, 31.9638] },
  { name: "Longview", coordinates: [-94.7405, 32.5007] },
  { name: "Kilgore", coordinates: [-94.8758, 32.3863] },
];

export const SERVICE_RADIUS_MILES = 35;
