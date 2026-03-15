import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { WeatherSnapshot } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string): Observable<WeatherSnapshot> {
    const params = location ? new HttpParams().set('location', location) : undefined;
    return this.http.get<WeatherSnapshot>(`${environment.apiUrl}/weather`, { params });
  }
}
