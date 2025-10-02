import { Herder, MarketPrice, WeatherAlert } from './types';

export const CURRENT_USER_ID = '6';

export const MOCK_HERDERS: Herder[] = [
  {
    id: '1',
    name: 'Nkrumah Ole Saitoti',
    location: 'Kajiado, Kenya',
    avatarUrl: 'https://picsum.photos/seed/nkrumah/200',
    memberSince: 2018,
    livestock: [
      { type: 'cattle', count: 45, healthStatus: 'good', lastVetVisit: '2024-11-15' },
      { type: 'goats', count: 120, healthStatus: 'excellent' },
      { type: 'sheep', count: 80, healthStatus: 'good' }
    ],
    herdSize: 245,
    seasonsHerd: 12,
    avgIncomePerSeason: 180000, // KSh
    repaymentHistory: { totalLoans: 8, repaidOnTime: 8, defaulted: 0 },
    trustScore: 95,
    bio: 'Third-generation Maasai herder specializing in premium cattle for Nairobi markets. I use traditional grazing techniques combined with modern veterinary care. Looking to expand my herd and access better markets.',
    isNomadic: true,
    communityRole: 'elder',
    preferredMarkets: ['Nairobi', 'Kajiado', 'Machakos'],
    connections: [
      { herderId: '6', type: 'borrowed', amount: 50000, status: 'Active', dueDate: '2024-12-15', purpose: 'Feed during drought', yearsConnected: 4, loansCompleted: 2 },
      { herderId: '2', type: 'lent', amount: 30000, status: 'Repaid', dueDate: '2024-08-10', purpose: 'Veterinary services', yearsConnected: 3, loansCompleted: 3 }
    ]
  },
  {
    id: '2',
    name: 'Amina Hassan',
    location: 'Garissa, Kenya',
    avatarUrl: 'https://picsum.photos/seed/amina/200',
    memberSince: 2020,
    livestock: [
      { type: 'camels', count: 25, healthStatus: 'excellent', lastVetVisit: '2024-10-20' },
      { type: 'goats', count: 60, healthStatus: 'good' },
      { type: 'sheep', count: 40, healthStatus: 'fair' }
    ],
    herdSize: 125,
    seasonsHerd: 8,
    avgIncomePerSeason: 120000,
    repaymentHistory: { totalLoans: 5, repaidOnTime: 4, defaulted: 1 },
    trustScore: 78,
    bio: 'Somali pastoralist focused on camel milk production for urban markets. Part of women\'s cooperative for dairy processing. One loan was delayed due to drought but fully repaid.',
    isNomadic: true,
    communityRole: 'women_leader',
    preferredMarkets: ['Nairobi', 'Garissa', 'Mombasa'],
    connections: [
      { herderId: '6', type: 'lent', amount: 80000, status: 'Active', dueDate: '2025-01-30', purpose: 'Milk processing equipment', yearsConnected: 3, loansCompleted: 2 },
      { herderId: '1', type: 'borrowed', amount: 30000, status: 'Repaid', dueDate: '2024-08-10', purpose: 'Veterinary services', yearsConnected: 3, loansCompleted: 3 }
    ]
  },
  {
    id: '3',
    name: 'Joseph Lolimo',
    location: 'Turkana, Kenya',
    avatarUrl: 'https://picsum.photos/seed/joseph/200',
    memberSince: 2021,
    livestock: [
      { type: 'cattle', count: 30, healthStatus: 'good' },
      { type: 'goats', count: 80, healthStatus: 'excellent' },
      { type: 'donkeys', count: 5, healthStatus: 'good' }
    ],
    herdSize: 115,
    seasonsHerd: 6,
    avgIncomePerSeason: 95000,
    repaymentHistory: { totalLoans: 3, repaidOnTime: 3, defaulted: 0 },
    trustScore: 88,
    bio: 'Turkana herder with clean repayment record. Known for reliable livestock quality and fair dealing. Need loan for water infrastructure and feed storage.',
    isNomadic: true,
    communityRole: 'youth',
    preferredMarkets: ['Lodwar', 'Kitale', 'Eldoret'],
    connections: [
      { herderId: '6', type: 'borrowed', amount: 40000, status: 'Repaid', dueDate: '2024-05-20', purpose: 'Water tank', yearsConnected: 3, loansCompleted: 2 },
      { herderId: '2', type: 'borrowed', amount: 25000, status: 'Repaid', dueDate: '2024-09-15', purpose: 'Feed', yearsConnected: 2, loansCompleted: 2 }
    ]
  },
  {
    id: '4',
    name: 'Fatuma Abdi',
    location: 'Wajir, Kenya',
    avatarUrl: 'https://picsum.photos/seed/fatuma/200',
    memberSince: 2017,
    livestock: [
      { type: 'camels', count: 35, healthStatus: 'excellent' },
      { type: 'cattle', count: 20, healthStatus: 'good' },
      { type: 'goats', count: 100, healthStatus: 'good' }
    ],
    herdSize: 155,
    seasonsHerd: 14,
    avgIncomePerSeason: 150000,
    repaymentHistory: { totalLoans: 10, repaidOnTime: 9, defaulted: 1 },
    trustScore: 85,
    bio: 'Experienced pastoralist with long history in the region. Focus on sustainable grazing and premium livestock. One past loan was restructured but fully paid.',
    isNomadic: true,
    communityRole: 'elder',
    preferredMarkets: ['Nairobi', 'Wajir', 'Mandera'],
    connections: [
      { herderId: '1', type: 'lent', amount: 60000, status: 'Repaid', dueDate: '2024-03-20', purpose: 'Water infrastructure', yearsConnected: 5, loansCompleted: 4 },
      { herderId: '2', type: 'lent', amount: 70000, status: 'Active', dueDate: '2025-03-10', purpose: 'Processing facility', yearsConnected: 4, loansCompleted: 3 }
    ]
  },
  {
    id: '5',
    name: 'Peter Kiprop',
    location: 'Laikipia, Kenya',
    avatarUrl: 'https://picsum.photos/seed/peter/200',
    memberSince: 2022,
    livestock: [
      { type: 'cattle', count: 50, healthStatus: 'excellent' },
      { type: 'sheep', count: 60, healthStatus: 'good' }
    ],
    herdSize: 110,
    seasonsHerd: 4,
    avgIncomePerSeason: 200000,
    repaymentHistory: { totalLoans: 2, repaidOnTime: 2, defaulted: 0 },
    trustScore: 92,
    bio: 'Relatively new to pastoralism but part of a successful cooperative. Strong community reputation and contract with premium meat buyers. Seeking funds for processing and branding.',
    isNomadic: false,
    communityRole: 'youth',
    preferredMarkets: ['Nairobi', 'Nakuru', 'Nyeri'],
    connections: [
      { herderId: '1', type: 'borrowed', amount: 80000, status: 'Active', dueDate: '2025-02-28', purpose: 'Processing equipment', yearsConnected: 2, loansCompleted: 1 },
      { herderId: '3', type: 'borrowed', amount: 45000, status: 'Active', dueDate: '2025-01-20', purpose: 'Storage facility', yearsConnected: 2, loansCompleted: 1 }
    ]
  },
  {
    id: '6',
    name: 'Mary Wanjiku',
    location: 'Kajiado, Kenya',
    avatarUrl: 'https://picsum.photos/seed/mary/200',
    memberSince: 2019,
    livestock: [
      { type: 'cattle', count: 60, healthStatus: 'excellent' },
      { type: 'goats', count: 90, healthStatus: 'excellent' },
      { type: 'sheep', count: 70, healthStatus: 'good' }
    ],
    herdSize: 220,
    seasonsHerd: 10,
    avgIncomePerSeason: 250000,
    repaymentHistory: { totalLoans: 6, repaidOnTime: 6, defaulted: 0 },
    trustScore: 98,
    bio: 'Model pastoralist with perfect repayment history. Specializes in premium livestock for Nairobi markets. Known for sustainable grazing practices and community leadership.',
    isNomadic: false,
    communityRole: 'women_leader',
    preferredMarkets: ['Nairobi', 'Kajiado', 'Machakos'],
    connections: [
      { herderId: '1', type: 'lent', amount: 50000, status: 'Active', dueDate: '2024-12-15', purpose: 'Feed during drought', yearsConnected: 4, loansCompleted: 2 },
      { herderId: '3', type: 'lent', amount: 40000, status: 'Repaid', dueDate: '2024-05-20', purpose: 'Water tank', yearsConnected: 3, loansCompleted: 2 }
    ]
  }
];

export const MOCK_MARKET_PRICES: MarketPrice[] = [
  { livestockType: 'cattle', pricePerHead: 45000, market: 'Nairobi', date: '2024-12-01', quality: 'premium' },
  { livestockType: 'cattle', pricePerHead: 35000, market: 'Nairobi', date: '2024-12-01', quality: 'standard' },
  { livestockType: 'goats', pricePerHead: 8000, market: 'Nairobi', date: '2024-12-01', quality: 'premium' },
  { livestockType: 'goats', pricePerHead: 6000, market: 'Nairobi', date: '2024-12-01', quality: 'standard' },
  { livestockType: 'camels', pricePerHead: 120000, market: 'Nairobi', date: '2024-12-01', quality: 'premium' },
  { livestockType: 'sheep', pricePerHead: 12000, market: 'Nairobi', date: '2024-12-01', quality: 'premium' }
];

export const MOCK_WEATHER_ALERTS: WeatherAlert[] = [
  {
    id: 'a1',
    type: 'drought',
    severity: 'high',
    message: 'Drought conditions expected in Kajiado region. Consider moving herds to water-rich areas.',
    location: 'Kajiado, Kenya',
    validUntil: '2024-12-15',
    actionRequired: 'Plan water access and feed storage'
  },
  {
    id: 'a2',
    type: 'market_opportunity',
    severity: 'medium',
    message: 'High demand for premium cattle in Nairobi markets. Prices up 15% this week.',
    location: 'Nairobi, Kenya',
    validUntil: '2024-12-10',
    actionRequired: 'Consider selling premium livestock'
  }
];