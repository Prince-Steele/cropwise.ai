import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { YieldRequest } from '../../models/yield.model';
import { MarketService } from '../../services/market.service';
import { YieldService } from '../../services/yield.service';

interface MarketPriceEntry {
  commodity: string;
  variety: string;
  low: number;
  high: number;
  freq: number;
  suggested: number;
}

@Component({
  selector: 'app-yield-prediction',
  templateUrl: './yield-prediction.component.html',
  styleUrls: ['./yield-prediction.component.css']
})
export class YieldPredictionComponent implements OnInit {
  calcData: YieldRequest = {
    crop: 'Tomato',
    area: null,
    soil: 'Good',
    weather: 'Optimal'
  };

  availableCrops = [
    'Tomato',
    'Callaloo',
    'Sweet Pepper',
    'Yellow Yam',
    'Pumpkin',
    'Irish Potato',
    'Sweet Potato',
    'Cucumber',
    'Watermelon'
  ];

  weatherPatterns = [
    'Optimal',
    'Dry',
    'Wet',
    'Hot and windy',
    'Cool and rainy',
    'Unstable showers'
  ];

  isCalculating = false;
  hasPrediction = false;

  predictedYield = 0;
  predictedYieldPerAcre = 0;
  growthDuration = 0;
  confidenceScore = 0;
  errorMessage = '';
  matchedCropProfile = '';
  marketPrices: MarketPriceEntry[] = [];
  priceDisplayLabel = '';
  suggestedSellingPrice = 0;
  estimatedGrossRevenue = 0;
  marketCurrency = 'JMD';

  constructor(
    private yieldService: YieldService,
    private marketService: MarketService
  ) { }

  ngOnInit(): void {}

  calculateYield() {
    if (!this.calcData.area || this.calcData.area <= 0) {
      this.errorMessage = 'Enter a valid acreage before calculating.';
      return;
    }

    if (!this.calcData.crop.trim()) {
      this.errorMessage = 'Enter a crop type before calculating.';
      return;
    }

    if (!this.calcData.weather.trim()) {
      this.errorMessage = 'Enter a weather pattern before calculating.';
      return;
    }

    this.isCalculating = true;
    this.hasPrediction = false;
    this.errorMessage = '';
    this.marketPrices = [];
    this.priceDisplayLabel = '';
    this.suggestedSellingPrice = 0;
    this.estimatedGrossRevenue = 0;

    forkJoin({
      yieldResult: this.yieldService.calculateYield(this.calcData),
      market: this.marketService.getLatestPrices(this.calcData.crop).pipe(catchError(() => of(null)))
    })
      .pipe(finalize(() => {
        this.isCalculating = false;
      }))
      .subscribe({
        next: ({ yieldResult, market }) => {
          this.predictedYield = yieldResult.predictedYield;
          this.predictedYieldPerAcre = yieldResult.predictedYieldPerAcre;
          this.growthDuration = yieldResult.growthDuration;
          this.confidenceScore = yieldResult.confidenceScore;
          this.matchedCropProfile = yieldResult.matchedCropProfile;
          this.applyMarketPricing(market);
          this.hasPrediction = true;
        },
        error: () => {
          this.hasPrediction = false;
          this.errorMessage = 'The calculator could not generate a forecast right now.';
        }
      });
  }

  private applyMarketPricing(marketResponse: any): void {
    const prices = marketResponse?.data?.prices || [];
    this.marketCurrency = marketResponse?.data?.currency || 'JMD';
    this.marketPrices = prices.slice(0, 3);

    if (!this.marketPrices.length) {
      this.priceDisplayLabel = 'No direct market match found for this crop.';
      return;
    }

    const primaryMatch = this.marketPrices[0];
    this.suggestedSellingPrice = primaryMatch.freq || primaryMatch.suggested || primaryMatch.low;
    this.estimatedGrossRevenue = Math.round(this.predictedYield * this.suggestedSellingPrice);
    this.priceDisplayLabel = `${primaryMatch.commodity} (${primaryMatch.variety})`;
  }
}
