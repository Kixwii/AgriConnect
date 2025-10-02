import { Farmer } from './types';

export const CURRENT_USER_ID = '6';

export const MOCK_FARMERS: Farmer[] = [
  {
    id: '1',
    name: 'Akinyi Odhiambo',
    location: 'Kisumu, Kenya',
    avatarUrl: 'https://picsum.photos/seed/akinyi/200',
    memberSince: 2018,
    crops: ['Maize', 'Beans', 'Sorghum'],
    seasonsFarmed: 12,
    avgYieldKgPerHectare: 2500,
    repaymentHistory: { totalLoans: 8, repaidOnTime: 8, defaulted: 0 },
    trustScore: 95,
    bio: 'A third-generation farmer specializing in drought-resistant maize varieties. I use conservation tillage techniques to preserve soil moisture and have consistently improved my yield year over year. Looking to expand my farm by 2 hectares.',
    connections: [
        { farmerId: '6', type: 'borrowed', amount: 500, status: 'Active', dueDate: '2024-12-15', purpose: 'Seed purchase', yearsConnected: 4, loansCompleted: 2 },
        { farmerId: '2', type: 'lent', amount: 300, status: 'Repaid', dueDate: '2024-08-10', purpose: 'Fertilizer', yearsConnected: 3, loansCompleted: 3 },
        { farmerId: '4', type: 'borrowed', amount: 800, status: 'Repaid', dueDate: '2024-03-20', purpose: 'Irrigation repair', yearsConnected: 5, loansCompleted: 4 },
        { farmerId: '5', type: 'lent', amount: 200, status: 'Active', dueDate: '2025-02-28', purpose: 'Processing equipment', yearsConnected: 2, loansCompleted: 1 },
    ]
  },
  {
    id: '2',
    name: 'Bello Adebayo',
    location: 'Oyo, Nigeria',
    avatarUrl: 'https://picsum.photos/seed/bello/200',
    memberSince: 2020,
    crops: ['Cassava', 'Yams', 'Cocoa'],
    seasonsFarmed: 8,
    avgYieldKgPerHectare: 15000,
    repaymentHistory: { totalLoans: 5, repaidOnTime: 4, defaulted: 1 },
    trustScore: 78,
    bio: 'Focused on root crops and cocoa for export. My last loan was delayed due to a regional flood, but was fully repaid. I am an active member of the local cocoa cooperative and am seeking funds for new fermentation equipment.',
    connections: [
        { farmerId: '6', type: 'lent', amount: 1200, status: 'Active', dueDate: '2025-01-30', purpose: 'Transport truck', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '1', type: 'borrowed', amount: 300, status: 'Repaid', dueDate: '2024-08-10', purpose: 'Fertilizer', yearsConnected: 3, loansCompleted: 3 },
        { farmerId: '3', type: 'lent', amount: 450, status: 'Repaid', dueDate: '2024-09-15', purpose: 'Seeds', yearsConnected: 2, loansCompleted: 2 },
        { farmerId: '4', type: 'borrowed', amount: 900, status: 'Active', dueDate: '2025-03-10', purpose: 'Fermentation equipment', yearsConnected: 4, loansCompleted: 3 },
    ]
  },
  {
    id: '3',
    name: 'Chidinma Eze',
    location: 'Enugu, Nigeria',
    avatarUrl: 'https://picsum.photos/seed/chidinma/200',
    memberSince: 2021,
    crops: ['Rice', 'Vegetables'],
    seasonsFarmed: 6,
    avgYieldKgPerHectare: 4000,
    repaymentHistory: { totalLoans: 3, repaidOnTime: 3, defaulted: 0 },
    trustScore: 88,
    bio: 'I run a small-scale organic vegetable farm and supply to local markets. Recently started rice cultivation in a small paddy. My record is clean and I am known for my reliability. Need a loan for a new irrigation pump.',
    connections: [
        { farmerId: '6', type: 'borrowed', amount: 250, status: 'Repaid', dueDate: '2024-05-20', purpose: 'Irrigation pump', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '2', type: 'borrowed', amount: 450, status: 'Repaid', dueDate: '2024-09-15', purpose: 'Seeds', yearsConnected: 2, loansCompleted: 2 },
        { farmerId: '5', type: 'lent', amount: 350, status: 'Active', dueDate: '2025-01-20', purpose: 'Storage facility', yearsConnected: 2, loansCompleted: 1 },
        { farmerId: '4', type: 'borrowed', amount: 600, status: 'Repaid', dueDate: '2024-07-30', purpose: 'Greenhouse materials', yearsConnected: 3, loansCompleted: 2 },
    ]
  },
  {
    id: '4',
    name: 'Diallo Traoré',
    location: 'Sikasso, Mali',
    avatarUrl: 'https://picsum.photos/seed/diallo/200',
    memberSince: 2017,
    crops: ['Cotton', 'Millet'],
    seasonsFarmed: 14,
    avgYieldKgPerHectare: 1200,
    repaymentHistory: { totalLoans: 10, repaidOnTime: 9, defaulted: 1 },
    trustScore: 85,
    bio: 'Experienced cotton farmer with a long history in the region. My focus is on sustainable farming practices. One past loan was restructured but fully paid. I am looking to invest in better quality seeds for the next season.',
    connections: [
        { farmerId: '1', type: 'lent', amount: 800, status: 'Repaid', dueDate: '2024-03-20', purpose: 'Irrigation repair', yearsConnected: 5, loansCompleted: 4 },
        { farmerId: '2', type: 'lent', amount: 900, status: 'Active', dueDate: '2025-03-10', purpose: 'Fermentation equipment', yearsConnected: 4, loansCompleted: 3 },
        { farmerId: '3', type: 'lent', amount: 600, status: 'Repaid', dueDate: '2024-07-30', purpose: 'Greenhouse materials', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '6', type: 'borrowed', amount: 700, status: 'Repaid', dueDate: '2024-10-05', purpose: 'Quality seeds', yearsConnected: 4, loansCompleted: 3 },
        { farmerId: '5', type: 'lent', amount: 550, status: 'Active', dueDate: '2025-02-15', purpose: 'Processing machinery', yearsConnected: 3, loansCompleted: 2 },
    ]
  },
  {
    id: '5',
    name: 'Fatima Al-Hassan',
    location: 'Tamale, Ghana',
    avatarUrl: 'https://picsum.photos/seed/fatima/200',
    memberSince: 2022,
    crops: ['Shea Nuts', 'Groundnuts'],
    seasonsFarmed: 4,
    avgYieldKgPerHectare: 800,
    repaymentHistory: { totalLoans: 2, repaidOnTime: 2, defaulted: 0 },
    trustScore: 92,
    bio: 'Relatively new to farming but part of a women\'s cooperative for shea butter production. We have a strong community reputation and a contract with an international buyer. Seeking funds for processing machinery.',
    connections: [
        { farmerId: '1', type: 'borrowed', amount: 200, status: 'Active', dueDate: '2025-02-28', purpose: 'Processing equipment', yearsConnected: 2, loansCompleted: 1 },
        { farmerId: '3', type: 'borrowed', amount: 350, status: 'Active', dueDate: '2025-01-20', purpose: 'Storage facility', yearsConnected: 2, loansCompleted: 1 },
        { farmerId: '4', type: 'borrowed', amount: 550, status: 'Active', dueDate: '2025-02-15', purpose: 'Processing machinery', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '6', type: 'lent', amount: 400, status: 'Repaid', dueDate: '2024-11-10', purpose: 'Market stall expansion', yearsConnected: 2, loansCompleted: 2 },
    ]
  },
  {
    id: '6',
    name: 'Kofi Mensah',
    location: 'Kumasi, Ghana',
    avatarUrl: 'https://picsum.photos/seed/kofi/200',
    memberSince: 2019,
    crops: ['Plantain', 'Cassava'],
    seasonsFarmed: 10,
    avgYieldKgPerHectare: 12000,
    repaymentHistory: { totalLoans: 6, repaidOnTime: 6, defaulted: 0 },
    trustScore: 98,
    bio: 'My farm is a model for intercropping plantain and cassava, maximizing land use. I have a perfect repayment history and a stable income from selling at the Kumasi Central Market. I plan to acquire a truck for transport.',
    connections: [
        { farmerId: '1', type: 'lent', amount: 500, status: 'Active', dueDate: '2024-12-15', purpose: 'Seed purchase', yearsConnected: 4, loansCompleted: 2 },
        { farmerId: '3', type: 'lent', amount: 250, status: 'Repaid', dueDate: '2024-05-20', purpose: 'Irrigation pump', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '2', type: 'borrowed', amount: 1200, status: 'Active', dueDate: '2025-01-30', purpose: 'Transport truck', yearsConnected: 3, loansCompleted: 2 },
        { farmerId: '4', type: 'lent', amount: 700, status: 'Repaid', dueDate: '2024-10-05', purpose: 'Quality seeds', yearsConnected: 4, loansCompleted: 3 },
        { farmerId: '5', type: 'borrowed', amount: 400, status: 'Repaid', dueDate: '2024-11-10', purpose: 'Market stall expansion', yearsConnected: 2, loansCompleted: 2 },
    ]
  }
];