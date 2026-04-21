export interface Job {
  id: string;
  title: string;
  company: Company;
  location: string;
  source: 'LinkedIn' | 'Indeed' | 'Glassdoor' | 'Naukri' | 'CareerPage';
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  seniority: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Director';
  postedAt: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly';
    note?: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: {
    name: string;
    isMatched?: boolean;
  }[];
  applyUrl: string;
  perks: string[];
  compensationInsight?: string;
  glassdoorRating?: number;
  reviewCount?: number;
}

export interface Company {
  name: string;
  logo?: string;
  founder?: string;
  ceo?: string;
  headcount?: string;
  hq?: string;
  allLocations?: string[];
  industry?: string;
  fundingStage?: string;
  linkedinFollowers?: string;
  techStack?: string[];
  workingDays?: string;
  workingHours?: string;
  remotePolicy?: string;
  flexibilityScore?: number; // 1-5 dot bar
  about?: string;
}

export interface MatchAnalysis {
  score: number;
  verdict: string;
  greenFlags: string[];
  redFlags: string[];
  gapAnalysis: string;
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  resumeUrl?: string;
  skills: string[];
  preferences: {
    locations: string[];
    jobTypes: string[];
    minSalary?: number;
  };
}

export interface Bookmark {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'Draft' | 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  appliedAt: string;
}
