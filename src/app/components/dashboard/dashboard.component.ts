import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <h1>CropWise Farmer Dashboard</h1>
      <p *ngIf="isLoggedIn">Welcome back, farmer!</p>
      <p *ngIf="!isLoggedIn">Please log in to view personalized insights.</p>
      
      <div class="grid-container">
        <!-- Dashboard summary cards go here -->
        <div class="card">
          <h3>Market Overview</h3>
          <p>Quick glance at current commodity prices.</p>
        </div>
        <div class="card">
          <h3>AI Recommendations</h3>
          <p>View your latest crop recommendations.</p>
        </div>
      </div>

      <div class="dashboard-sections">
        <app-market-prices></app-market-prices>
        <app-recommendation-form></app-recommendation-form>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; font-family: sans-serif; }
    .grid-container { display: flex; gap: 20px; margin-top: 20px; }
    .card { padding: 20px; border: 1px solid #ddd; border-radius: 8px; flex: 1; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .dashboard-sections { display: grid; gap: 24px; margin-top: 24px; }
  `]
})
export class DashboardComponent implements OnInit {
  isLoggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      this.isLoggedIn = !!user;
    });
  }
}
