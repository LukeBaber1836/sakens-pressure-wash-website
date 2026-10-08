// Placeholder reviews until real Google reviews are pulled in. Swap these out entry for entry;
// the section reads everything it shows from this list.
export type Review = {
  name: string;
  /** Town shown under the reviewer's name. */
  location: string;
  /** The job they hired Saken for. */
  service: string;
  /** Whole stars, 1–5. */
  rating: number;
  text: string;
};

export const reviews: Review[] = [
  {
    name: "Jessica Moreno",
    location: "Tyler, TX",
    service: "House soft wash",
    rating: 5,
    text: "Our siding had green streaks on the north side for years. Saken soft washed the whole house in an afternoon and it honestly looks brand new. He walked the property with me before and after.",
  },
  {
    name: "David Whitaker",
    location: "Whitehouse, TX",
    service: "Driveway cleaning",
    rating: 5,
    text: "Showed up right on time, gave a fair quote on the spot, and got oil stains out of our driveway that I'd written off as permanent. Already booked him again for the spring.",
  },
  {
    name: "Karen Ellis",
    location: "Lindale, TX",
    service: "Roof cleaning",
    rating: 5,
    text: "I was nervous about anyone on our roof, but he explained the low-pressure process and took real care around the shingles. The black streaks are completely gone.",
  },
  {
    name: "Marcus Bell",
    location: "Tyler, TX",
    service: "Commercial building washing",
    rating: 5,
    text: "We use Saken for our storefront and sidewalks every quarter. Professional, easy to schedule, and the building looks sharp for our customers every time.",
  },
  {
    name: "Amanda Pruitt",
    location: "Flint, TX",
    service: "Patio cleaning",
    rating: 5,
    text: "Our flagstone patio was covered in algae and slick as ice. Now it looks like the day it was laid. Super friendly and he cleaned up everything when he was done.",
  },
  {
    name: "Chris Navarro",
    location: "Bullard, TX",
    service: "Fence washing",
    rating: 4,
    text: "Fence went from gray to the original wood color. Took a little longer than planned because of the rain, but he kept me updated the whole way and the result was worth it.",
  },
  {
    name: "Rebecca Howard",
    location: "Longview, TX",
    service: "Gutter cleaning",
    rating: 5,
    text: "Gutters cleared out and the outsides brightened up to match the trim. You can tell he takes pride in his work. Great communication from the first call.",
  },
  {
    name: "Tom Gallagher",
    location: "Kilgore, TX",
    service: "Parking lot cleaning",
    rating: 5,
    text: "He handled our church parking lot and walkways overnight so nothing interrupted Sunday. Gum and oil spots are gone. Couldn't ask for a better local business to work with.",
  },
  {
    name: "Lauren Chu",
    location: "Chandler, TX",
    service: "Sidewalk & walkway cleaning",
    rating: 5,
    text: "Booked a free estimate expecting a sales pitch and instead got honest advice on what actually needed cleaning. Walkways and front steps look amazing. Highly recommend.",
  },
];
