// Copy for the Services page. Each entry's id matches services-breakdown-data, so the explorer's dots
// can jump to it and the quote form can preselect it. Everything here is a first draft to edit.

export type Method = "soft" | "pressure" | "both";

export type ServiceDetail = {
  id: string;
  name: string;
  includes: string[];
  method: Method;
  /** For before/after collages: how the two shots are laid out, so they can be labeled. */
  photo: { src: string; alt: string; beforeAfter?: "stacked" | "side" };
};

export const residentialDetails: ServiceDetail[] = [
  {
    id: "roof",
    name: "Roof cleaning",
    includes: [
      "Algae, moss and lichen treated and rinsed",
      "Low pressure that's safe for asphalt shingles",
      "Plants and landscaping wetted down and protected",
    ],
    method: "soft",
    photo: {
      src: "/images/before-after-roof-dormers-01.jpeg",
      alt: "Before and after of a shingle roof with dormers, streaked with algae before and clean after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "siding",
    name: "House soft wash",
    includes: [
      "All sides of the house, top to bottom",
      "Mildew and green growth killed, not just rinsed",
      "Trim, soffits and front entry included",
    ],
    method: "soft",
    photo: {
      src: "/images/before-after-white-siding-house-01.jpeg",
      alt: "Before and after of a white-sided house, dingy before and bright after",
      beforeAfter: "side",
    },
  },
  {
    id: "windows",
    name: "Window cleaning",
    includes: [
      "Exterior glass on every reachable window",
      "Frames, sills and tracks wiped down",
      "Water-fed pole for upper floors",
    ],
    method: "soft",
    photo: {
      src: "/images/crew-window-squeegee-01.jpeg",
      alt: "Crew member squeegeeing a front window",
    },
  },
  {
    id: "gutters",
    name: "Gutter cleaning",
    includes: [
      "Leaves and debris cleared from gutters",
      "Downspouts flushed",
      "Gutter faces and fascia brightened",
    ],
    method: "soft",
    photo: {
      src: "/images/before-after-gutter-fascia-01.jpeg",
      alt: "Before and after of gutters and fascia, streaked before and clean after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "fence",
    name: "Fence washing",
    includes: [
      "Both sides of the fence",
      "Gray weathering and mildew lifted",
      "Pressure set for wood, so it isn't furred",
    ],
    method: "both",
    photo: {
      src: "/images/before-after-wood-fence-01.jpeg",
      alt: "Before and after of a wooden fence and gate, gray before and warm wood after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "patio",
    name: "Patio cleaning",
    includes: [
      "Algae and slippery growth removed",
      "Joints and edges cleaned out",
      "Furniture moved and put back",
    ],
    method: "pressure",
    photo: {
      src: "/images/before-after-flagstone-patio-seating-01.jpeg",
      alt: "Before and after of a flagstone patio with seating, darkened before and clean after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "driveway",
    name: "Driveway pressure washing",
    includes: [
      "Even, stripe-free surface cleaning",
      "Oil and rust spots pre-treated",
      "Edges and curb line finished by hand",
    ],
    method: "pressure",
    photo: {
      src: "/images/before-after-concrete-driveway-curve-01.jpeg",
      alt: "Before and after of a curved concrete driveway, dark and stained before and bright after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "sidewalk",
    name: "Sidewalk & walkway cleaning",
    includes: [
      "Front walks, side paths and steps",
      "Slippery algae removed",
      "Edges along the lawn kept tidy",
    ],
    method: "pressure",
    photo: {
      src: "/images/before-after-curved-walkway-01.jpeg",
      alt: "Before and after of a curved concrete walkway, stained before and clean after",
      beforeAfter: "side",
    },
  },
];

export const commercialDetails: ServiceDetail[] = [
  {
    id: "building",
    name: "Commercial building washing",
    includes: [
      "Walls, awnings and entryways",
      "Lift work for tall buildings",
      "Scheduled around your business hours",
    ],
    method: "soft",
    photo: {
      src: "/images/before-after-chapel-entrance-01.jpeg",
      alt: "Before and after of a chapel entrance, dingy before and clean after",
      beforeAfter: "stacked",
    },
  },
  {
    id: "gas-station",
    name: "Gas station maintenance",
    includes: [
      "Fuel spills and grease degreased",
      "Pump islands, columns and bollards",
      "Recurring schedules available",
    ],
    method: "pressure",
    photo: {
      src: "/images/car-wash-night-01.jpeg",
      alt: "A commercial lot being washed overnight under the lights",
    },
  },
  {
    id: "parking-lot",
    name: "Parking lot cleaning",
    includes: [
      "Gum and oil stain removal",
      "Curbs, islands and entrances",
      "Overnight work so the lot stays open",
    ],
    method: "pressure",
    photo: {
      src: "/images/before-after-parking-lot-curb-01.jpeg",
      alt: "Before and after of a parking lot curb, stained before and clean after",
      beforeAfter: "side",
    },
  },
  {
    id: "post-construction",
    name: "Post-construction cleanup",
    includes: [
      "Mortar and dust off brick and siding",
      "Driveways and walks cleared of mud",
      "Ready for the final walkthrough",
    ],
    method: "both",
    photo: {
      src: "/images/new-build-white-brick-house-01.jpeg",
      alt: "A newly built white brick and siding home after its cleanup",
    },
  },
  {
    id: "dumpster-pad",
    name: "Dumpster pad cleaning",
    includes: [
      "Grease and food waste degreased",
      "Enclosure walls and gates",
      "Odor-reducing rinse",
    ],
    method: "pressure",
    photo: {
      src: "/images/before-after-dumpster-pad-01.jpeg",
      alt: "Before and after of a dumpster pad, grimy before and clean after",
      beforeAfter: "stacked",
    },
  },
];

export const hoaPackage: Omit<ServiceDetail, "name" | "method"> & {
  title: string;
  summary: string;
} = {
  id: "hoa",
  title: "Add us to your HOA package",
  summary:
    "If you run an HOA, you can make Saken's Pressure Washing part of your neighborhood's upkeep. We come out on a schedule you set and keep the shared spaces looking their best.",
  includes: [
    "Sidewalks and walking trails",
    "Entrance signs and monument walls",
    "Clubhouses, pavilions and pool buildings",
    "Playground and amenity areas",
  ],
  photo: {
    src: "/images/before-after-playground-sidewalk-01.jpeg",
    alt: "Before and after of a sidewalk beside a playground, stained before and clean after",
    beforeAfter: "side",
  },
};

export const methods = [
  {
    id: "soft",
    name: "Soft wash",
    tagline: "Low pressure, cleaning solution does the work",
    text: "A gentle spray of cleaning solution kills algae, mold and mildew at the root, then a low-pressure rinse carries it away. It cleans deeper than pressure alone and lasts longer, without damaging delicate surfaces.",
    usedOn: [
      "Roofs",
      "Vinyl and painted siding",
      "Stucco",
      "Windows and screens",
      "Gutters",
    ],
  },
  {
    id: "pressure",
    name: "Pressure wash",
    tagline: "High pressure for hard, durable surfaces",
    text: "High-pressure water, usually through a spinning surface cleaner, strips ground-in dirt, oil and gum from tough surfaces evenly, without the stripes a wand alone leaves behind.",
    usedOn: [
      "Driveways",
      "Sidewalks",
      "Patios and pavers",
      "Parking lots",
      "Dumpster pads",
    ],
  },
] as const;

// Placeholder questions and answers, to be replaced with Saken's own.
export const faqs = [
  {
    q: "How much does pressure washing cost?",
    a: "Every property is different, so Saken comes out and gives you a free, honest price in person. There's no charge for the estimate and no pressure to book.",
  },
  {
    q: "Is soft washing safe for my roof, plants and pets?",
    a: "Yes. Soft washing uses low pressure, so it won't damage shingles or siding. We wet down and rinse your plants before and after, and ask that pets stay inside while we work.",
  },
  {
    q: "How often should I have my house washed?",
    a: "Most homes in East Texas do well with a house wash once a year, and a roof cleaning every two to three years. Shady, humid spots may need it a little more often.",
  },
  {
    q: "Do I need to be home while you work?",
    a: "Not usually. We just need access to an outdoor water spigot and any gates. We'll let you know when we're done and walk the property with you if you're around.",
  },
  {
    q: "Are you licensed and insured?",
    a: "Yes. Saken's Pressure Washing is fully licensed and insured, and we're happy to send proof of insurance before we start.",
  },
];
