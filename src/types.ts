export interface Loan {
  herderId: string; // The ID of the herder on the other end of the transaction
  type: 'lent' | 'borrowed';
  amount: number;
  status: 'Active' | 'Repaid';
  dueDate: string;
  purpose: string;
  yearsConnected: number;
  loansCompleted: number;
}

export interface Livestock {
  type: 'cattle' | 'goats' | 'sheep' | 'camels' | 'donkeys';
  count: number;
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  lastVetVisit?: string;
}

export interface MarketPrice {
  livestockType: string;
  pricePerHead: number;
  market: string;
  date: string;
  quality: 'premium' | 'standard' | 'grade_b' | 'grade_c';
}

export interface WeatherAlert {
  id: string;
  type: 'drought' | 'flood' | 'disease_outbreak' | 'market_opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  validUntil: string;
  actionRequired?: string;
}

export interface Herder {
  id: string;
  name: string;
  location: string;
  avatarUrl: string;
  memberSince: number;
  livestock: Livestock[];
  herdSize: number;
  seasonsHerd: number;
  avgIncomePerSeason: number;
  repaymentHistory: {
    totalLoans: number;
    repaidOnTime: number;
    defaulted: number;
  };
  trustScore: number;
  bio: string;
  connections?: Loan[];
  isNomadic: boolean;
  communityRole: 'elder' | 'youth' | 'women_leader' | 'member';
  preferredMarkets: string[];
}

export interface LoanRequest {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  purpose: 'feed' | 'veterinary' | 'transport' | 'water_infrastructure' | 'processing' | 'other';
}

export interface RepaymentInstallment {
  installment: number;
  amount: number;
  suggestedDate: string;
  reasoning: string;
}

export type RepaymentPlan = RepaymentInstallment[];