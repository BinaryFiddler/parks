export interface Memory {
  text: string;
  image?: string;
}

export interface Visit {
  start: string;
  end: string;
}

export interface Park {
  id: string;
  name: string;
  states: string[];
  description: string;
  visits?: Visit[];
  memories?: Memory[];
}

export const PARKS: Park[] = [
  {
    id: 'acadia',
    name: 'Acadia National Park',
    states: ['Maine'],
    description:
      'Picturesque Atlantic coastline with granite peaks and rocky beaches.',
  },
  {
    id: 'arches',
    name: 'Arches National Park',
    states: ['Utah'],
    description: 'Home to over 2,000 natural sandstone arches.',
  },
  {
    id: 'badlands',
    name: 'Badlands National Park',
    states: ['South Dakota'],
    description: 'Fossil beds and striking layered rock formations.',
  },
  {
    id: 'bryce-canyon',
    name: 'Bryce Canyon National Park',
    states: ['Utah'],
    description: 'Known for crimson hoodoos and sweeping vistas.',
    visits: [
      { start: '2018-05-02', end: '2018-05-05' },
    ],
    memories: [
      {
        text: 'Sunrise at Bryce Point',
        image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=60',
      },
    ],
  },
  {
    id: 'denali',
    name: 'Denali National Park',
    states: ['Alaska'],
    description: 'Six million acres of Alaskan wilderness centered on Denali peak.',
  },
  {
    id: 'everglades',
    name: 'Everglades National Park',
    states: ['Florida'],
    description: 'Vast wetlands preserve with mangroves and abundant wildlife.',
  },
  {
    id: 'glacier',
    name: 'Glacier National Park',
    states: ['Montana'],
    description: 'Rugged peaks, alpine meadows and many glaciers.',
  },
  {
    id: 'grand-canyon',
    name: 'Grand Canyon National Park',
    states: ['Arizona'],
    description: 'A natural wonder carving deep red rock for over 277 miles.',
    visits: [
      { start: '2019-07-10', end: '2019-07-12' },
    ],
    memories: [
      {
        text: 'Sunset at Hopi Point',
        image: 'https://images.unsplash.com/photo-1508264165352-258859e62245?auto=format&fit=crop&w=800&q=60',
      },
    ],
  },
  {
    id: 'grand-teton',
    name: 'Grand Teton National Park',
    states: ['Wyoming'],
    description: 'Iconic jagged peaks rising above Jackson Hole valley.',
  },
  {
    id: 'great-smoky-mountains',
    name: 'Great Smoky Mountains National Park',
    states: ['Tennessee', 'North Carolina'],
    description: 'America\'s most visited park, famous for mist-covered mountains.',
  },
  {
    id: 'joshua-tree',
    name: 'Joshua Tree National Park',
    states: ['California'],
    description: 'Where the Mojave and Colorado deserts converge.',
  },
  {
    id: 'olympic',
    name: 'Olympic National Park',
    states: ['Washington'],
    description: 'Rainforests, alpine peaks and rugged Pacific coastline.',
  },
  {
    id: 'redwood',
    name: 'Redwood National Park',
    states: ['California'],
    description: 'Protects some of the tallest trees on Earth.',
  },
  {
    id: 'rocky-mountain',
    name: 'Rocky Mountain National Park',
    states: ['Colorado'],
    description: 'High peaks and alpine lakes in the Colorado Rockies.',
    visits: [
      { start: '2020-09-01', end: '2020-09-05' },
    ],
  },
  {
    id: 'sequoia',
    name: 'Sequoia National Park',
    states: ['California'],
    description: 'Home to massive sequoia trees including General Sherman.',
  },
  {
    id: 'shenandoah',
    name: 'Shenandoah National Park',
    states: ['Virginia'],
    description: 'Skyline Drive runs the length of this scenic Appalachian park.',
  },
  {
    id: 'yellowstone',
    name: 'Yellowstone National Park',
    states: ['Wyoming', 'Montana', 'Idaho'],
    description: 'Home to geysers like Old Faithful and an array of wildlife.',
  },
  {
    id: 'yosemite',
    name: 'Yosemite National Park',
    states: ['California'],
    description: 'Famous for its towering granite cliffs and waterfalls.',
    visits: [
      { start: '2021-06-10', end: '2021-06-15' },
    ],
    memories: [
      {
        text: 'Hiked Half Dome',
        image: 'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&w=800&q=60',
      },
      { text: 'Camped at Tuolumne Meadows' },
    ],
  },
  {
    id: 'zion',
    name: 'Zion National Park',
    states: ['Utah'],
    description: 'Known for steep red cliffs and scenic canyon trails.',
  },
];
