export type HistoryType = 'success' | 'warning' | 'danger';

export interface CropHistory {
  crop: string;
  season: string;
  acres: number;
  yield: number;
  status: string;
  type: HistoryType;
  harvested?: string;
}

export interface FarmerProfile {
  name: string;
  location: string;
  activeSince: number | null;
  profileImage?: string;
  totalAcres: number;
  certifications: string[];
  lifetimeYield: number;
  successfulHarvests: number;
  primaryCrops: number;
  history: CropHistory[];
}
