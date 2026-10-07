export type HouseService = {
  id: string;
  name: string;
  description: string;
  /** Hotspot position as a percentage of the house image's width and height. */
  x: number;
  y: number;
};

export const houseServices: HouseService[] = [
  {
    id: "roof",
    name: "Roof cleaning",
    description:
      "Low-pressure soft wash that lifts black streaks, moss, and algae without damaging your shingles.",
    x: 36.5,
    y: 22,
  },
  {
    id: "siding",
    name: "House soft wash",
    description:
      "Gentle cleaning for vinyl, brick, and painted siding that clears away mildew, dirt, and pollen.",
    x: 44,
    y: 40,
  },
  {
    id: "windows",
    name: "Window cleaning",
    description: "Streak-free exterior glass, plus the frames and sills around it.",
    x: 57.8,
    y: 37.7,
  },
  {
    id: "gutters",
    name: "Gutter cleaning",
    description:
      "Debris cleared out and the outside of gutters and downspouts brightened back up.",
    x: 70.2,
    y: 40,
  },
  {
    id: "fence",
    name: "Fence washing",
    description:
      "Wood and vinyl fences restored by washing away gray weathering, mildew, and grime.",
    x: 86,
    y: 48,
  },
  {
    id: "patio",
    name: "Patio cleaning",
    description:
      "Pavers, stone, and concrete patios cleaned up so your outdoor space is ready to use.",
    x: 85.4,
    y: 69,
  },
  {
    id: "driveway",
    name: "Driveway pressure washing",
    description: "Surface cleaning that lifts oil spots, tire marks, and ground-in dirt from concrete.",
    x: 49,
    y: 73,
  },
  {
    id: "sidewalk",
    name: "Sidewalk & walkway cleaning",
    description:
      "Walkways and sidewalks cleaned edge to edge, removing grime and slippery algae.",
    x: 17,
    y: 72,
  },
];
