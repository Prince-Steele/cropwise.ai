import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-yield-prediction',
  templateUrl: './yield-prediction.component.html',
  styleUrls: ['./yield-prediction.component.css']
})
export class YieldPredictionComponent implements OnInit {

  calcData = {
    crop: 'Tomato',
    area: null,
    soil: 'Good',
    weather: 'Optimal'
  };

  isCalculating = false;
  hasPrediction = false;

  predictedYield = 0;
  predictedYieldPerAcre = 0;
  growthDuration = 0;

  // Base yields per acre (in kg)
  baseYields: { [key: string]: number } = {
    'Tomato': 15000,
    'Callaloo': 8000,
    'Pepper': 12000,
    'Yam': 10000
  };

  baseDuration: { [key: string]: number } = {
    'Tomato': 75,
    'Callaloo': 45,
    'Pepper': 85,
    'Yam': 270
  };

  constructor() { }

  ngOnInit(): void {
  }

  calculateYield() {
    if (!this.calcData.area) {
      return;
    }

    this.isCalculating = true;
    this.hasPrediction = false;

    // Simulate complex calculation
    setTimeout(() => {
      let baseYield = this.baseYields[this.calcData.crop];
      let multiplier = 1.0;

      // Apply soil multiplier
      if (this.calcData.soil === 'Excellent') multiplier += 0.15;
      else if (this.calcData.soil === 'Good') multiplier += 0.05;
      else if (this.calcData.soil === 'Fair') multiplier -= 0.10;
      else if (this.calcData.soil === 'Poor') multiplier -= 0.25;

      // Apply weather multiplier
      if (this.calcData.weather === 'Dry') multiplier -= 0.20;
      else if (this.calcData.weather === 'Wet') multiplier -= 0.15;

      this.predictedYieldPerAcre = Math.round(baseYield * multiplier);
      this.predictedYield = Math.round(this.predictedYieldPerAcre * (this.calcData.area || 0));
      this.growthDuration = this.baseDuration[this.calcData.crop];

      this.isCalculating = false;
      this.hasPrediction = true;
    }, 1500);
  }
}
