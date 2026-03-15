import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private apiUrl = `${environment.apiBaseUrl}/market`;

  constructor(private http: HttpClient) {}

  getLatestPrices(symbols: string[] = ['WHEAT', 'CORN', 'COFFEE', 'SUGAR']): Observable<any> {
    const symbolStr = symbols.join(',');
    return this.http.get(`${this.apiUrl}/latest?symbols=${symbolStr}`);
  }

  getHistoricalPrices(date: string, symbols: string[]): Observable<any> {
    const symbolStr = symbols.join(',');
    return this.http.get(`${this.apiUrl}/historical?date=${date}&symbols=${symbolStr}`);
  }
}
