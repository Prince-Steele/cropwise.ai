import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { YieldRequest } from '../../models/yield.model';
import { YieldService } from '../../services/yield.service';

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

  isCalculating = false;
  hasPrediction = false;

  predictedYield = 0;
  predictedYieldPerAcre = 0;
  growthDuration = 0;

  constructor(private yieldService: YieldService) { }

  ngOnInit(): void {
  }

  calculateYield() {
    if (!this.calcData.area) {
      return;
    }

    this.isCalculating = true;
    this.hasPrediction = false;
    this.yieldService.calculateYield(this.calcData)
      .pipe(finalize(() => {
        this.isCalculating = false;
      }))
      .subscribe({
        next: (response) => {
          this.predictedYield = response.predictedYield;
          this.predictedYieldPerAcre = response.predictedYieldPerAcre;
          this.growthDuration = response.growthDuration;
          this.hasPrediction = true;
        },
        error: () => {
          this.hasPrediction = false;
        }
      });
  }
}
