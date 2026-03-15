import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AdvisorRequest, AdvisorResponse, AdvisorRecommendation } from '../models/advisor.model';
import { Recommendation } from '../models/recommendation.model';

interface CropRule {
  crop: string;
  baseYieldPerAcre: number;
  preferredSeasons: string[];
  preferredSoils: string[];
  dryFriendly: boolean;
  humidFriendly: boolean;
  note: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  private readonly cropRules: CropRule[] = [
    {
      crop: 'Sweet Pepper',
      baseYieldPerAcre: 950,
      preferredSeasons: ['spring', 'summer'],
      preferredSoils: ['loam', 'sandy'],
      dryFriendly: false,
      humidFriendly: false,
      note: 'Strong market crop when drainage and pest monitoring are well managed.'
    },
    {
      crop: 'Callaloo',
      baseYieldPerAcre: 780,
      preferredSeasons: ['spring', 'summer', 'autumn'],
      preferredSoils: ['loam', 'silt', 'peaty'],
      dryFriendly: true,
      humidFriendly: true,
      note: 'Fast-cycle crop with flexible planting windows and reliable turnover.'
    },
    {
      crop: 'Pumpkin',
      baseYieldPerAcre: 1400,
      preferredSeasons: ['summer', 'autumn'],
      preferredSoils: ['sandy', 'loam', 'chalky'],
      dryFriendly: true,
      humidFriendly: false,
      note: 'Resilient field crop that handles heat better than most vegetable options.'
    },
    {
      crop: 'Irish Potato',
      baseYieldPerAcre: 1800,
      preferredSeasons: ['winter', 'spring'],
      preferredSoils: ['clay', 'loam', 'silt'],
      dryFriendly: false,
      humidFriendly: false,
      note: 'Good choice in cooler windows if drainage and disease control are kept tight.'
    },
    {
      crop: 'Tomato',
      baseYieldPerAcre: 1100,
      preferredSeasons: ['spring', 'winter'],
      preferredSoils: ['loam', 'silt'],
      dryFriendly: false,
      humidFriendly: false,
      note: 'High upside crop but more exposed to disease and weather swings.'
    },
    {
      crop: 'Yellow Yam',
      baseYieldPerAcre: 1250,
      preferredSeasons: ['summer', 'autumn'],
      preferredSoils: ['clay', 'loam'],
      dryFriendly: true,
      humidFriendly: true,
      note: 'Stable root crop option when longer harvest cycles fit the farm plan.'
    }
  ];

  getRecommendations(farmData: AdvisorRequest): Observable<AdvisorResponse> {
    const normalizedSeason = farmData.season.toLowerCase();
    const normalizedSoil = (farmData.soilType || '').toLowerCase();
    const normalizedHistory = (farmData.history || '').toLowerCase();
    const normalizedLocation = farmData.location.toLowerCase();
    const landSize = Number(farmData.landSize || 0);

    const ranked = this.cropRules
      .map((rule) => this.buildRecommendation(rule, normalizedSeason, normalizedSoil, normalizedHistory, normalizedLocation, landSize))
      .sort((left, right) => right.score - left.score);

    const response: AdvisorResponse = {
      topChoice: ranked[0].recommendation,
      alternatives: ranked.slice(1, 3).map((item) => item.recommendation)
    };

    return of(response).pipe(delay(300));
  }

  getRecentRecommendations(): Observable<Recommendation[]> {
    return of([
      {
        crop: 'Sweet Pepper',
        risk: 'Low',
        note: 'Strong fit for current temperature and rainfall balance.',
        recommended: true
      },
      {
        crop: 'Pumpkin',
        risk: 'Low',
        note: 'Good fallback option with strong drought tolerance.',
        recommended: false
      },
      {
        crop: 'Tomato',
        risk: 'Medium',
        note: 'Good margins, but disease pressure needs tighter monitoring.',
        recommended: false
      }
    ]).pipe(delay(250));
  }

  private buildRecommendation(
    rule: CropRule,
    season: string,
    soil: string,
    history: string,
    location: string,
    landSize: number
  ): { score: number; recommendation: AdvisorRecommendation } {
    let score = 50;

    if (rule.preferredSeasons.includes(season)) {
      score += 18;
    }

    if (soil && rule.preferredSoils.includes(soil)) {
      score += 16;
    }

    if (history.includes(rule.crop.toLowerCase())) {
      score -= 12;
    }

    if (location.includes('st. elizabeth') || location.includes('clarendon')) {
      if (rule.dryFriendly) {
        score += 8;
      }
    }

    if (location.includes('portland') || location.includes('st. mary')) {
      if (rule.humidFriendly) {
        score += 8;
      }
    }

    if (landSize >= 5 && (rule.crop === 'Pumpkin' || rule.crop === 'Yellow Yam')) {
      score += 6;
    }

    if (landSize > 0 && landSize <= 2 && (rule.crop === 'Callaloo' || rule.crop === 'Sweet Pepper' || rule.crop === 'Tomato')) {
      score += 6;
    }

    const estimatedYield = Math.round(rule.baseYieldPerAcre * Math.max(landSize, 1));
    const risk = score >= 75 ? 'Low' : score >= 58 ? 'Medium' : 'High';

    return {
      score,
      recommendation: {
        crop: rule.crop,
        risk,
        estimatedYield,
        daysToHarvest: this.getDaysToHarvest(rule.crop),
        insight: this.buildInsight(rule, season, soil, history)
      }
    };
  }

  private buildInsight(rule: CropRule, season: string, soil: string, history: string): string {
    const details = [rule.note];

    if (rule.preferredSeasons.includes(season)) {
      details.push(`Seasonal timing looks favorable for ${rule.crop.toLowerCase()}.`);
    }

    if (soil && rule.preferredSoils.includes(soil)) {
      details.push(`${soil[0].toUpperCase()}${soil.slice(1)} soil is a good match.`);
    }

    if (history.includes(rule.crop.toLowerCase())) {
      details.push('Recent planting history suggests rotating acreage instead of going all-in.');
    }

    return details.join(' ');
  }

  private getDaysToHarvest(crop: string): string {
    switch (crop) {
      case 'Callaloo':
        return '35-45 days';
      case 'Sweet Pepper':
        return '75-90 days';
      case 'Pumpkin':
        return '90-120 days';
      case 'Irish Potato':
        return '90-110 days';
      case 'Tomato':
        return '70-85 days';
      case 'Yellow Yam':
        return '210-270 days';
      default:
        return '60-90 days';
    }
  }
}
