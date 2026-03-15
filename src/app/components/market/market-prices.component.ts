import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../services/market.service';

@Component({
  selector: 'app-market-prices',
  template: `
    <div class="market-container">
      <h2>Commodity Market Prices</h2>
      
      <div *ngIf="loading">Loading prices...</div>
      
      <div *ngIf="error" class="error-msg">{{ error }}</div>
      
      <table *ngIf="!loading && !error">
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let symbol of marketData | keyvalue">
            <td>{{ symbol.key }}</td>
            <td>{{ symbol.value | currency:'USD' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .market-container { padding: 20px; }
    table { width: 100%; max-width: 500px; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f4f4f4; }
    .error-msg { color: red; }
  `]
})
export class MarketPricesComponent implements OnInit {
  marketData: Record<string, number> = {};
  loading = true;
  error = '';

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.marketService.getLatestPrices().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.marketData = res.data.rates;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load market prices.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
