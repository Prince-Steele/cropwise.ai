import { Component } from '@angular/core';
import { RecommendationService, SoilParams } from '../../services/recommendation.service';

@Component({
  selector: 'app-recommendation-form',
  template: `
    <div class="form-container">
      <h2>AI Crop Recommendation</h2>
      <p>Enter soil and weather parameters to get a machine-learning based recommendation.</p>

      <form (ngSubmit)="onSubmit()" #recForm="ngForm">
        <div class="form-group">
          <label>Nitrogen (mg/kg):</label>
          <input type="number" name="nitrogen" [(ngModel)]="data.nitrogen" required>
        </div>
        <div class="form-group">
          <label>Temperature (C):</label>
          <input type="number" name="temperature" [(ngModel)]="data.temperature" required>
        </div>
        <div class="form-group">
          <label>Rainfall (mm):</label>
          <input type="number" name="rainfall" [(ngModel)]="data.rainfall" required>
        </div>
        <button type="submit" [disabled]="!recForm.form.valid || loading">
          {{ loading ? 'Analyzing...' : 'Get Recommendation' }}
        </button>
      </form>

      <div *ngIf="result" class="result-card">
        <h3>Recommended Crop: <span class="highlight">{{ result.recommended_crop | titlecase }}</span></h3>
        <p>Confidence: {{ result.confidence * 100 }}%</p>
        <p class="notes">{{ result.notes }}</p>
        <button (click)="saveHistory()">Save to History</button>
      </div>
    </div>
  `,
  styles: [`
    .form-container { max-width: 500px; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px 15px; background: #2e7d32; color: white; border: none; cursor: pointer; border-radius: 4px; margin-top: 10px; }
    button:disabled { background: #9e9e9e; }
    .result-card { margin-top: 20px; padding: 15px; background: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px; }
    .highlight { color: #2e7d32; font-weight: bold; }
    .notes { font-style: italic; font-size: 0.9em; }
  `]
})
export class RecommendationFormComponent {
  data: SoilParams = {
    nitrogen: 90,
    phosphorus: 40,
    potassium: 40,
    temperature: 25,
    humidity: 80,
    ph: 6.5,
    rainfall: 150
  };

  loading = false;
  result: any = null;

  constructor(private recService: RecommendationService) {}

  onSubmit() {
    this.loading = true;
    this.result = null;

    this.recService.predict(this.data).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.result = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to get recommendation');
      }
    });
  }

  saveHistory() {
    if (!this.result) return;
    this.recService.saveRecommendation(this.data, this.result.recommended_crop, this.result.confidence, 'Saved via dashboard').subscribe({
      next: () => alert('Successfully saved to history!'),
      error: () => alert('Failed to save to history. Are you logged in?')
    });
  }
}
