import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdvisorRequest, AdvisorResponse } from '../models/advisor.model';
import { Recommendation } from '../models/recommendation.model';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private http: HttpClient) { }

  getRecommendations(farmData: AdvisorRequest): Observable<AdvisorResponse> {
    return this.http.post<AdvisorResponse>(`${environment.apiUrl}/advisor`, farmData);
  }

  getRecentRecommendations(): Observable<Recommendation[]> {
    return this.http.get<Recommendation[]>(`${environment.apiUrl}/recommendations`);
  }
}
