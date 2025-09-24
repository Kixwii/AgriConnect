export interface Loan {
  farmerId: string; // The ID of the farmer on the other end of the transaction
  type: 'lent' | 'borrowed';
  amount: number;
  status: 'Active' | 'Repaid';
  dueDate: string;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  avatarUrl: string;
  memberSince: number; 
  crops: string[];
  seasonsFarmed: number;
  avgYieldKgPerHectare: number;
  repaymentHistory: {
    totalLoans: number;
    repaidOnTime: number;
    defaulted: number;
  };
  trustScore: number;
  bio: string;
  connections?: Loan[];
}

export interface LoanRequest {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}
