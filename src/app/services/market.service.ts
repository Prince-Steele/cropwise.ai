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

  getLatestPrices(search = ''): Observable<any> {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return this.http.get(`${this.apiUrl}/latest${query}`);
  }

  getHistoricalPrices(date: string, search = ''): Observable<any> {
    const query = search ? `&search=${encodeURIComponent(search)}` : '';
    return this.http.get(`${this.apiUrl}/historical?date=${date}${query}`);
  }
}
