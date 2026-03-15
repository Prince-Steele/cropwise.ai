export interface YieldRequest {
  crop: string;
  area: number | null;
  soil: string;
  weather: string;
}

export interface YieldResponse {
  crop: string;
  matchedCropProfile: string;
  predictedYield: number;
  predictedYieldPerAcre: number;
  growthDuration: number;
  confidenceScore: number;
}
