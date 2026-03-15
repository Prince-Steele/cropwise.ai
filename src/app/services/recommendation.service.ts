import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface SoilParams {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = `${environment.apiBaseUrl}/recommendation`;

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {}

  // Public endpoint
  predict(data: SoilParams): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Protected endpoint
  saveRecommendation(inputData: any, recommendedCrop: string, confidence: number, notes: string): Observable<any> {
    return from(this.supabaseService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/save`, {
          input_data: inputData,
          recommended_crop: recommendedCrop,
          confidence,
          notes
        }, { headers });
      })
    );
  }

  // Protected endpoint
  getMyHistory(): Observable<any> {
    return from(this.supabaseService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/my-history`, { headers });
      })
    );
  }
}
