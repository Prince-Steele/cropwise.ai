import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../services/market.service';

interface MarketPriceEntry {
  commodity: string;
  variety: string;
  low: number;
  high: number;
  freq: number;
  suggested: number;
}

@Component({
  selector: 'app-market-prices',
  template: `
    <div class="market-container">
      <h2>Produce Market Prices</h2>

      <div *ngIf="loading">Loading prices...</div>

      <div *ngIf="error" class="error-msg">{{ error }}</div>

      <table *ngIf="!loading && !error">
        <thead>
          <tr>
            <th>Commodity</th>
            <th>Variety</th>
            <th>Low</th>
            <th>High</th>
            <th>Frequent</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of marketData">
            <td>{{ item.commodity }}</td>
            <td>{{ item.variety }}</td>
            <td>{{ item.low | currency:'JMD':'symbol':'1.0-0' }}</td>
            <td>{{ item.high | currency:'JMD':'symbol':'1.0-0' }}</td>
            <td>{{ item.freq | currency:'JMD':'symbol':'1.0-0' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .market-container { padding: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f4f4f4; }
    .error-msg { color: red; }
  `]
})
export class MarketPricesComponent implements OnInit {
  marketData: MarketPriceEntry[] = [];
  loading = true;
  error = '';

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.marketService.getLatestPrices().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.marketData = res.data.prices;
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
