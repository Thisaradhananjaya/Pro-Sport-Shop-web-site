const categoriesData = [
  {
    name: 'Cricket',
    slug: 'cricket',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
    description: 'Pro grade bats, protective gear & authentic leather balls.',
    itemCount: 42,
  },
  {
    name: 'Badminton',
    slug: 'badminton',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    description: 'High-tension carbon graphite rackets and competition shuttles.',
    itemCount: 28,
  },
  {
    name: 'Football',
    slug: 'football',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    description: 'FIFA approved match balls, studded boots & goal guard equipment.',
    itemCount: 35,
  },
  {
    name: 'Fitness',
    slug: 'fitness',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy duty dumbbells, power racks, resistance bands and accessories.',
    itemCount: 56,
  },
  {
    name: 'Running',
    slug: 'running',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-cushioned marathon runners, spikes and athletic GPS accessories.',
    itemCount: 31,
  },
  {
    name: 'Apparel',
    slug: 'apparel',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=800&q=80',
    description: 'Moisture-wicking activewear, compression gear and training kits.',
    itemCount: 64,
  },
];

const productsData = [
  {
    id: 'prod-1',
    title: 'SG Savage Edition Bat',
    category: 'CRICKET',
    price: 24500,
    originalPrice: 28000,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
    brand: 'SG Cricket',
    description: 'Grade 1 English Willow crafted with immense power profile, massive edges and dynamic balance engineered for match-winning strokes.',
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    featured: true,
    specs: [
      { label: 'Willow Grade', value: 'Grade 1 English Willow' },
      { label: 'Weight', value: '1180g - 1220g' },
      { label: 'Handle', value: '12 Piece Sarawak Cane' },
      { label: 'Profile', value: 'Full Mid-to-Low Sweetspot' }
    ]
  },
  {
    id: 'prod-2',
    title: 'Yonex Astrox 99 Pro',
    category: 'BADMINTON',
    price: 32800,
    originalPrice: 36500,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    brand: 'Yonex',
    description: 'Dominate the court with steep, unreturnable power smashes. Built with Namd graphite and Rotational Generator System for lightning rebounds.',
    rating: 5.0,
    reviewsCount: 52,
    inStock: true,
    featured: true,
    specs: [
      { label: 'Flex', value: 'Extra Stiff' },
      { label: 'Balance', value: 'Head Heavy' },
      { label: 'Weight / Grip', value: '4U (Avg. 83g) G5' },
      { label: 'String Tension', value: 'Up to 28 lbs' }
    ]
  },
  {
    id: 'prod-3',
    title: 'Adidas Al Rihla Matchball',
    category: 'FOOTBALL',
    price: 18900,
    originalPrice: 21500,
    image: 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&w=800&q=80',
    brand: 'Adidas',
    description: 'Official match ball technology with Speedshell polyurethane skin, thermally bonded seamless construction and highest FIFA Quality Pro certification.',
    rating: 4.8,
    reviewsCount: 44,
    inStock: true,
    featured: true,
    specs: [
      { label: 'Surface', value: 'Thermally Bonded Seamless' },
      { label: 'Certification', value: 'FIFA Quality Pro' },
      { label: 'Bladder', value: 'Butyl Rubber' },
      { label: 'Size', value: 'Standard Size 5' }
    ]
  },
  {
    id: 'prod-4',
    title: 'Nike Pegasus 40 Runner',
    category: 'RUNNING',
    price: 29500,
    originalPrice: 33000,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    brand: 'Nike',
    description: 'A springy ride for every run. Features dual Zoom Air units and React foam technology delivering responsive cushioning and breathable lockdown mesh.',
    rating: 4.9,
    reviewsCount: 67,
    inStock: true,
    featured: true,
    specs: [
      { label: 'Cushioning', value: 'Nike React + Dual Zoom Air' },
      { label: 'Drop', value: '10mm' },
      { label: 'Weight', value: '288g (Men US 10)' },
      { label: 'Terrain', value: 'Road / Athletic Track' }
    ]
  },
  {
    id: 'prod-5',
    title: 'Under Armour Tech Tee',
    category: 'APPAREL',
    price: 4800,
    originalPrice: 5500,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    brand: 'Under Armour',
    description: 'UA Tech fabric is quick-drying, ultra-soft and has a more natural feel. Anti-odor technology prevents the growth of odor-causing microbes.',
    rating: 4.7,
    reviewsCount: 29,
    inStock: true,
    featured: true,
    specs: [
      { label: 'Material', value: '100% Polyester Tech Weave' },
      { label: 'Fit Type', value: 'Athletic Loose' },
      { label: 'Technology', value: 'Moisture Transport System' },
      { label: 'Care', value: 'Machine Wash Cold' }
    ]
  },
  {
    id: 'prod-6',
    title: 'Puma Ultra Ultimate FG Cleats',
    category: 'FOOTBALL',
    price: 34500,
    originalPrice: 38000,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=800&q=80',
    brand: 'Puma',
    description: 'Turn seconds into records with ULTRAWEAVE upper and SPEEDPLATE dual-density outsole for rapid propulsion on firm ground pitches.',
    rating: 4.8,
    reviewsCount: 19,
    inStock: true,
    featured: false,
    specs: [
      { label: 'Upper', value: 'Ultra-light ULTRAWEAVE' },
      { label: 'Soleplate', value: 'SPEEDPLATE Dual-Density' },
      { label: 'Surface', value: 'Firm Ground (FG/AG)' }
    ]
  },
  {
    id: 'prod-7',
    title: 'Pro Hex Dumbbell Set (Pair 15kg)',
    category: 'FITNESS',
    price: 22000,
    originalPrice: 25000,
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    brand: 'ProSport',
    description: 'Heavy duty rubber encased cast iron hexagonal dumbbells with knurled ergonomic chrome steel grips.',
    rating: 4.9,
    reviewsCount: 45,
    inStock: true,
    featured: false,
    specs: [
      { label: 'Core', value: 'Solid Cast Iron' },
      { label: 'Coating', value: 'Commercial Grade Virgin Rubber' },
      { label: 'Grip', value: 'Contoured Anti-Slip Knurl' }
    ]
  }
];

module.exports = {
  categoriesData,
  productsData,
};
