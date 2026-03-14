import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  // Mock implementation for Open-Meteo API
  getCurrentWeather(location: string): Observable<any> {
    return of({
      temperature: 28,
      condition: 'Sunny',
      humidity: 15,
      location: location || 'St. Ann, Jamaica'
    }).pipe(delay(500));
  }
}
