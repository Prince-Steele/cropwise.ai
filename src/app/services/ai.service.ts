import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { SoilParams } from './recommendation.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiBaseUrl}/ai`;

  constructor(private http: HttpClient) {}

  /**
   * Use Gemini AI to predict a recommended crop based on soil readings
   * @param params Soil and weather data
   */
  recommendCrop(params: SoilParams): Observable<any> {
    return this.http.post(`${this.apiUrl}/recommend-crop`, params);
  }

  /**
   * Ask Gemini a general farming question
   * @param query The question from the farmer
   */
  getFarmingAdvice(query: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/advice`, { query });
  }
}
