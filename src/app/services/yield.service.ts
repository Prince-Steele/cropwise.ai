import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { YieldRequest, YieldResponse } from '../models/yield.model';

@Injectable({
  providedIn: 'root'
})
export class YieldService {
  private readonly cropProfiles: Record<string, { yieldPerAcre: number; duration: number }> = {
    Tomato: { yieldPerAcre: 1150, duration: 78 },
    Callaloo: { yieldPerAcre: 820, duration: 42 },
    Pepper: { yieldPerAcre: 940, duration: 84 },
    Yam: { yieldPerAcre: 1320, duration: 240 },
    Pumpkin: { yieldPerAcre: 1400, duration: 105 },
    'Irish Potato': { yieldPerAcre: 1800, duration: 100 },
    'Sweet Potato': { yieldPerAcre: 1180, duration: 115 },
    Cucumber: { yieldPerAcre: 980, duration: 58 },
    Watermelon: { yieldPerAcre: 1550, duration: 95 }
  };

  private readonly soilMultiplier: Record<string, number> = {
    Excellent: 1.15,
    Good: 1,
    Fair: 0.86,
    Poor: 0.7
  };

  private readonly weatherMultiplier: Record<string, number> = {
    Optimal: 1.08,
    Dry: 0.82,
    Wet: 0.88
  };

  calculateYield(payload: YieldRequest): Observable<YieldResponse> {
    const matchedCropProfile = this.resolveCropProfile(payload.crop);
    const cropProfile = this.cropProfiles[matchedCropProfile];
    const area = Number(payload.area || 0);
    const soilFactor = this.soilMultiplier[payload.soil] || 1;
    const normalizedWeather = this.resolveWeatherPattern(payload.weather);
    const weatherFactor = this.weatherMultiplier[normalizedWeather] || 1;

    const predictedYieldPerAcre = Math.round(cropProfile.yieldPerAcre * soilFactor * weatherFactor);
    const predictedYield = Math.round(predictedYieldPerAcre * Math.max(area, 1));
    const growthAdjustment = normalizedWeather === 'Optimal' ? 0 : normalizedWeather === 'Dry' ? 8 : 5;
    const qualityAdjustment = payload.soil === 'Excellent' ? -4 : payload.soil === 'Poor' ? 10 : 0;

    return of({
      crop: payload.crop,
      matchedCropProfile,
      predictedYield,
      predictedYieldPerAcre,
      growthDuration: cropProfile.duration + growthAdjustment + qualityAdjustment,
      confidenceScore: this.calculateConfidence(payload.soil, normalizedWeather)
    }).pipe(delay(280));
  }

  private calculateConfidence(soil: string, weather: string): number {
    let score = 86;

    if (soil === 'Fair') score -= 8;
    if (soil === 'Poor') score -= 16;
    if (weather === 'Dry') score -= 10;
    if (weather === 'Wet') score -= 7;

    return Math.max(55, score);
  }

  private resolveCropProfile(crop: string): string {
    const normalized = this.normalize(crop);
    const knownCrops = Object.keys(this.cropProfiles);

    for (const knownCrop of knownCrops) {
      const normalizedKnownCrop = this.normalize(knownCrop);
      if (normalized === normalizedKnownCrop || normalized.includes(normalizedKnownCrop) || normalizedKnownCrop.includes(normalized)) {
        return knownCrop;
      }
    }

    if (normalized.includes('pepper')) return 'Pepper';
    if (normalized.includes('potato')) return normalized.includes('irish') ? 'Irish Potato' : 'Sweet Potato';
    if (normalized.includes('yam')) return 'Yam';
    if (normalized.includes('cucumber')) return 'Cucumber';
    if (normalized.includes('pumpkin')) return 'Pumpkin';
    if (normalized.includes('watermelon')) return 'Watermelon';

    return 'Tomato';
  }

  private resolveWeatherPattern(weather: string): string {
    const normalized = this.normalize(weather);

    if (normalized.includes('dry') || normalized.includes('hot') || normalized.includes('drought') || normalized.includes('windy')) {
      return 'Dry';
    }

    if (normalized.includes('wet') || normalized.includes('rain') || normalized.includes('storm') || normalized.includes('shower')) {
      return 'Wet';
    }

    return 'Optimal';
  }

  private normalize(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
}
