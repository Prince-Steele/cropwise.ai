export interface AdvisorRecommendation {
  crop: string;
  risk: string;
  estimatedYield: number;
  daysToHarvest?: string;
  insight: string;
}

export interface AdvisorRequest {
  location: string;
  landSize: number | null;
  season: string;
  history: string;
  soilType?: string;
  soilEvidenceName?: string;
}

export interface AdvisorResponse {
  topChoice: AdvisorRecommendation;
  alternatives: AdvisorRecommendation[];
}
