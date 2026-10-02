export type PropertyType = 'Kothi' | 'Plot' | 'Builder Floor' | 'Flat' | 'Commercial';
export type Purpose = 'Sale' | 'Rent';

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  purpose: Purpose;
  sector: string;
  price: string;
  priceValue: number;
  area: string;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  images: string[];
  amenities: string[];
  featured: boolean;
  mapEmbed: string;
  /** Floor plan image URLs. Leave out to show a "request floor plan" button. */
  floorPlans?: string[];
  /** YouTube embed URL, e.g. https://www.youtube.com/embed/VIDEO_ID */
  videoUrl?: string;
  /** Overrides the sector's default nearby places. */
  nearby?: NearbyPlace[];
}

export type NearbyCategory = 'school' | 'hospital' | 'market' | 'transport' | 'park';

export interface NearbyPlace {
  category: NearbyCategory;
  name: string;
  distance: string;
}

// Default nearby places per sector, used when a property has no `nearby` list.
// SAMPLE DATA — check names and distances before going live.
export const NEARBY_BY_SECTOR: Record<string, NearbyPlace[]> = {
  'Sector 4': [
    { category: 'school', name: 'Schools in Sector 4–5', distance: '1 km' },
    { category: 'hospital', name: 'Civil Hospital, Sector 6', distance: '2 km' },
    { category: 'market', name: 'Sector 5 Market', distance: '1.5 km' },
    { category: 'park', name: 'Cactus Garden, Sector 5', distance: '2 km' },
    { category: 'transport', name: 'Chandigarh', distance: '8 km' },
  ],
  'Sector 7': [
    { category: 'school', name: 'Schools in Sector 7–8', distance: '1 km' },
    { category: 'hospital', name: 'Civil Hospital, Sector 6', distance: '1.5 km' },
    { category: 'market', name: 'Sector 7 Market', distance: '0.5 km' },
    { category: 'park', name: 'Neighbourhood park', distance: '0.3 km' },
    { category: 'transport', name: 'Chandigarh', distance: '7 km' },
  ],
  'Sector 11': [
    { category: 'school', name: 'Schools in Sector 11–12', distance: '1 km' },
    { category: 'hospital', name: 'Hospitals near Sector 12', distance: '2 km' },
    { category: 'market', name: 'Sector 11 Market', distance: '0.5 km' },
    { category: 'park', name: 'Neighbourhood park', distance: '0.4 km' },
    { category: 'transport', name: 'Chandigarh', distance: '6 km' },
  ],
  'Sector 20': [
    { category: 'school', name: 'Schools in Sector 20', distance: '1 km' },
    { category: 'hospital', name: 'Hospitals near Sector 21', distance: '1.5 km' },
    { category: 'market', name: 'Sector 20 Market', distance: '0.8 km' },
    { category: 'park', name: 'Neighbourhood park', distance: '0.5 km' },
    { category: 'transport', name: 'Zirakpur', distance: '7 km' },
  ],
  MDC: [
    { category: 'school', name: 'Schools in MDC', distance: '1.5 km' },
    { category: 'hospital', name: 'Hospitals near MDC', distance: '2 km' },
    { category: 'market', name: 'MDC Commercial Belt', distance: '0.5 km' },
    { category: 'park', name: 'Neighbourhood park', distance: '0.6 km' },
    { category: 'transport', name: 'Chandigarh', distance: '6 km' },
  ],
};

export const HERO_VIDEO = {
  url: 'https://cdn.coverr.co/videos/coverr-luxury-house-at-night-1573/1080p.mp4',
  poster: 'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

export const QUOTE_VIDEO = {
  url: 'https://cdn.coverr.co/videos/coverr-modern-architecture-2634/1080p.mp4',
  poster: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1920',
};

export const QUOTES = [
  'A home is not where you live, it is where your story begins.',
  'Land is the one asset they are not making any more of.',
  'Great locations are timeless. Great homes are priceless.',
];

export const CATEGORIES = [
  { name: 'Kothi', number: '01', image: 'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200', desc: 'Independent luxury villas with private gardens and premium finishes.' },
  { name: 'Plot', number: '02', image: 'https://images.pexels.com/photos/4525178/pexels-photo-4525178.jpeg?auto=compress&cs=tinysrgb&w=1200', desc: 'Prime residential and commercial plots in Panchkula\u2019s most sought-after sectors.' },
  { name: 'Builder Floor', number: '03', image: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1200', desc: 'Spacious independent floors with privacy, parking, and modern design.' },
  { name: 'Flat', number: '04', image: 'https://images.pexels.com/photos/15951714/pexels-photo-15951714.jpeg?auto=compress&cs=tinysrgb&w=1200', desc: 'Premium apartments in gated communities with world-class amenities.' },
  { name: 'Commercial', number: '05', image: 'https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg?auto=compress&cs=tinysrgb&w=1200', desc: 'Showrooms, office spaces, and SCO plots on high-footfall corridors.' },
];

export const STATS = [
  { value: 15, suffix: '+', label: 'Years of Trust' },
  { value: 500, suffix: '+', label: 'Families Served' },
  { value: 300, suffix: '+', label: 'Properties Delivered' },
  { value: 100, suffix: '%', label: 'Transparency' },
];

export const PROCESS_STEPS = [
  { number: '01', title: 'Discovery', desc: 'We understand your vision, budget, and lifestyle needs in a detailed consultation.' },
  { number: '02', title: 'Curation', desc: 'Our team handpicks properties that match your criteria from our exclusive portfolio.' },
  { number: '03', title: 'Verification', desc: 'Every property undergoes rigorous legal and structural due diligence before listing.' },
  { number: '04', title: 'Handover', desc: 'We handle documentation, registration, and keys \u2014 a seamless, transparent closing.' },
];

export const TESTIMONIALS = [
  { quote: 'Pahwa Real Estate didn\u2019t just sell us a house. They found us a home where our children will grow up. Every detail was handled with care.', author: 'Rajesh & Sunita Sharma', location: 'Sector 7, Panchkula' },
  { quote: 'The transparency and professionalism was unmatched. From site visits to registration, everything was seamless and stress-free.', author: 'Dr. Anil Verma', location: 'Sector 20, Panchkula' },
  { quote: 'I invested in a commercial plot through Pahwa Real Estate. Three years later, the value has nearly doubled. Best decision I made.', author: 'Manpreet Kaur', location: 'MDC, Panchkula' },
  { quote: 'They understood exactly what we wanted \u2014 a kothi with a garden, in a quiet sector. They showed us three options and we found our dream home.', author: 'Arjun & Priya Mehta', location: 'Sector 4, Panchkula' },
  { quote: 'As an NRI, I needed someone I could trust completely. Pahwa Real Estate managed everything remotely with video tours and full documentation.', author: 'Harpreet Singh', location: 'Sector 11, Panchkula' },
];

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Luxury Kothi in Sector 7',
    type: 'Kothi',
    purpose: 'Sale',
    sector: 'Sector 7',
    price: '\u20B93.85 Cr',
    priceValue: 38500000,
    area: '5,200 sq.ft',
    bedrooms: 5,
    bathrooms: 6,
    description: 'An architectural masterpiece in the heart of Sector 7. This independent kothi features Italian marble flooring, a private landscaped garden, home automation, and a double-height entrance lobby. Designed for those who appreciate the finer things in life.',
    images: [
      'https://images.pexels.com/photos/8082322/pexels-photo-8082322.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6587852/pexels-photo-6587852.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Private Garden', 'Home Automation', 'Italian Marble', 'Modular Kitchen', 'Double-Height Lobby', 'Servant Quarters', 'Covered Parking (3)', 'Power Backup'],
    featured: true,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.85!3d30.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzI0LjAiTiA3NsKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '2',
    title: 'Premium Plot in Sector 4',
    type: 'Plot',
    purpose: 'Sale',
    sector: 'Sector 4',
    price: '\u20B91.25 Cr',
    priceValue: 12500000,
    area: '500 sq.yd',
    description: 'A prime residential plot in Sector 4, one of Panchkula\u2019s most prestigious addresses. Clear title, corner plot with park-facing frontage. Ready for construction with all approvals in place.',
    images: [
      'https://images.pexels.com/photos/4525178/pexels-photo-4525178.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/11201060/pexels-photo-11201060.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6875496/pexels-photo-6875496.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Corner Plot', 'Park Facing', 'Clear Title', 'All Approvals', 'Wide Road Front', 'Gated Sector'],
    featured: true,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.83!3d30.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzM2LjAiTiA3NsKwNDknNDguMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '3',
    title: 'Builder Floor in Sector 11',
    type: 'Builder Floor',
    purpose: 'Sale',
    sector: 'Sector 11',
    price: '\u20B985 Lakhs',
    priceValue: 8500000,
    area: '1,800 sq.ft',
    bedrooms: 3,
    bathrooms: 3,
    description: 'An independent builder floor with exclusive terrace rights. Spacious 3BHK with modular kitchen, premium fittings, and a private parking space. Located in a well-established neighborhood.',
    images: [
      'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7174113/pexels-photo-7174113.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7031879/pexels-photo-7031879.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Terrace Rights', 'Modular Kitchen', 'Private Parking', 'Premium Fittings', 'Spacious Balcony', 'Power Backup'],
    featured: true,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.84!3d30.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzAwLjAiTiA3NsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '4',
    title: '3BHK Flat in Sector 20',
    type: 'Flat',
    purpose: 'Sale',
    sector: 'Sector 20',
    price: '\u20B972 Lakhs',
    priceValue: 7200000,
    area: '1,650 sq.ft',
    bedrooms: 3,
    bathrooms: 2,
    description: 'A beautifully designed 3BHK apartment in a gated community with clubhouse, swimming pool, and 24/7 security. Spacious rooms with cross ventilation and balcony views of the Shivalik hills.',
    images: [
      'https://images.pexels.com/photos/15951714/pexels-photo-15951714.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8082243/pexels-photo-8082243.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7546323/pexels-photo-7546323.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8142046/pexels-photo-8142046.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Clubhouse', 'Swimming Pool', '24/7 Security', 'Gym', 'Power Backup', 'Children\u2019s Play Area', 'Covered Parking', 'Visitor Parking'],
    featured: true,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.87!3d30.69!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzI0LjAiTiA3NsKwNTInMTIuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '5',
    title: 'Commercial Showroom in MDC',
    type: 'Commercial',
    purpose: 'Sale',
    sector: 'MDC',
    price: '\u20B92.40 Cr',
    priceValue: 24000000,
    area: '2,800 sq.ft',
    description: 'A high-street commercial showroom on MDC\u2019s busiest corridor. Ground + Mezzanine with excellent frontage, ample parking, and high footfall. Perfect for retail brands or showrooms.',
    images: [
      'https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/10410086/pexels-photo-10410086.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/36631701/pexels-photo-36631701.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['High Street Frontage', 'Ground + Mezzanine', 'Ample Parking', 'High Footfall', 'Power Backup', 'Wide Frontage'],
    featured: true,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.86!3d30.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzU2LjAiTiA3NsKwNTEnMzYuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '6',
    title: 'Designer Kothi in Sector 4',
    type: 'Kothi',
    purpose: 'Sale',
    sector: 'Sector 4',
    price: '\u20B95.50 Cr',
    priceValue: 55000000,
    area: '6,500 sq.ft',
    bedrooms: 6,
    bathrooms: 7,
    description: 'A bespoke designer kothi with contemporary architecture, floor-to-ceiling windows, a temperature-controlled pool, and a home theatre. Set on a 1,000 sq.yd plot in Sector 4\u2019s most exclusive pocket.',
    images: [
      'https://images.pexels.com/photos/14603131/pexels-photo-14603131.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/35203563/pexels-photo-35203563.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/18285887/pexels-photo-18285887.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6587852/pexels-photo-6587852.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Temperature-Controlled Pool', 'Home Theatre', 'Floor-to-Ceiling Windows', 'Italian Marble', 'Smart Home', 'Landscaped Garden', '6 Covered Parking', 'Servant Quarters'],
    featured: false,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.83!3d30.71!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzM2LjAiTiA3NsKwNDknNDguMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '7',
    title: '2BHK Flat for Rent in Sector 11',
    type: 'Flat',
    purpose: 'Rent',
    sector: 'Sector 11',
    price: '\u20B928,000/mo',
    priceValue: 28000,
    area: '1,150 sq.ft',
    bedrooms: 2,
    bathrooms: 2,
    description: 'A well-maintained 2BHK apartment for rent in Sector 11. Semi-furnished with modular kitchen, ACs in both bedrooms, and a balcony with greenery views. Close to schools and markets.',
    images: [
      'https://images.pexels.com/photos/7174386/pexels-photo-7174386.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/7166640/pexels-photo-7166640.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/6903160/pexels-photo-6903160.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['Semi-Furnished', 'Modular Kitchen', 'AC in Bedrooms', 'Balcony', 'Covered Parking', '24/7 Security', 'Power Backup'],
    featured: false,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.84!3d30.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQyJzAwLjAiTiA3NsKwNTAnMjQuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
  {
    id: '8',
    title: 'SCO Plot in MDC',
    type: 'Commercial',
    purpose: 'Sale',
    sector: 'MDC',
    price: '\u20B91.80 Cr',
    priceValue: 18000000,
    area: '500 sq.yd',
    description: 'A strategically located SCO (Shop-Cum-Office) plot in MDC\u2019s commercial zone. Ideal for mixed-use development with ground-floor retail and upper-floor offices. High visibility and connectivity.',
    images: [
      'https://images.pexels.com/photos/10410086/pexels-photo-10410086.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/27647440/pexels-photo-27647440.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/19479278/pexels-photo-19479278.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    amenities: ['SCO Zoning', 'High Visibility', 'Corner Plot', 'Wide Road Access', 'Clear Title', 'Mixed Use Permitted'],
    featured: false,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3430.1!2d76.86!3d30.70!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDQxJzU2LjAiTiA3NsKwNTEnMzYuMCJF!5e0!3m2!1sen!2sin!4v0000000000000',
  },
];

export const SECTORS = ['All', 'Sector 4', 'Sector 7', 'Sector 11', 'Sector 20', 'MDC'];
export const TYPES = ['All', 'Kothi', 'Plot', 'Builder Floor', 'Flat', 'Commercial'];
export const PURPOSES = ['All', 'Sale', 'Rent'];

// New launches shown on the home page. To add a project, copy one entry,
// give it a new id and update the details — the section picks it up automatically.
export type ProjectStatus = 'Pre-Launch' | 'Under Construction' | 'Ready to Move';

export interface NewProject {
  id: string;
  name: string;
  developer: string;
  location: string;
  status: ProjectStatus;
  possession: string;
  configurations: string;
  sizeRange: string;
  startingPrice: string;
  image: string;
  highlights: string[];
}

export const NEW_PROJECTS: NewProject[] = [
  {
    id: 'np-1',
    name: 'The Grand Residences',
    developer: 'Sample Developer',
    location: 'Sector 20, Panchkula',
    status: 'Pre-Launch',
    possession: 'Dec 2028',
    configurations: '3 & 4 BHK Apartments',
    sizeRange: '1,850 – 2,600 sq.ft',
    startingPrice: '₹1.45 Cr',
    image: 'https://images.pexels.com/photos/15951714/pexels-photo-15951714.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Clubhouse & pool', 'Gated community', 'Early-bird pricing'],
  },
  {
    id: 'np-2',
    name: 'Greenview Floors',
    developer: 'Sample Developer',
    location: 'Sector 11, Panchkula',
    status: 'Under Construction',
    possession: 'Jun 2027',
    configurations: '3 BHK Builder Floors',
    sizeRange: '1,600 – 1,900 sq.ft',
    startingPrice: '₹95 Lakhs',
    image: 'https://images.pexels.com/photos/7031607/pexels-photo-7031607.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Stilt parking', 'Lift in every floor', 'Park facing'],
  },
  {
    id: 'np-3',
    name: 'MDC Business Square',
    developer: 'Sample Developer',
    location: 'MDC, Panchkula',
    status: 'Ready to Move',
    possession: 'Immediate',
    configurations: 'SCO & Retail Shops',
    sizeRange: '350 – 2,400 sq.ft',
    startingPrice: '₹65 Lakhs',
    image: 'https://images.pexels.com/photos/13219418/pexels-photo-13219418.jpeg?auto=compress&cs=tinysrgb&w=1200',
    highlights: ['Main road frontage', 'High footfall', 'Assured rental options'],
  },
];

// Short descriptions for the sector map. SAMPLE COPY — edit to match your market view.
export const SECTOR_INFO: Record<string, { vibe: string; tags: string[] }> = {
  'Sector 4': { vibe: 'One of Panchkula’s oldest, greenest addresses — wide roads, big plots and settled neighbours.', tags: ['Prestige address', 'Large plots', 'Green belts'] },
  'Sector 7': { vibe: 'Central and well-connected, with a busy market, schools and hospitals all minutes away.', tags: ['Central', 'Family friendly', 'Strong resale'] },
  'Sector 11': { vibe: 'Quiet residential pocket popular with families looking for builder floors and good value.', tags: ['Value for money', 'Quiet streets', 'Builder floors'] },
  'Sector 20': { vibe: 'Newer, fast-growing sector with modern group housing and quick access towards Zirakpur.', tags: ['Modern flats', 'Growth area', 'Gated societies'] },
  MDC: { vibe: 'Mansa Devi Complex — Panchkula’s commercial and mixed-use hub with strong rental demand.', tags: ['Commercial hub', 'Rental yield', 'SCO plots'] },
};

// Sale prices in Lakhs/Cr; small values are monthly rents
export const formatINR = (value: number) => {
  if (value >= 1e7) return `₹${(value / 1e7).toFixed(2).replace(/\.?0+$/, '')} Cr`;
  if (value >= 1e5) return `₹${Math.round(value / 1e5)} Lakhs`;
  return `₹${value.toLocaleString('en-IN')}/mo`;
};
