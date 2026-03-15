import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { WeatherSnapshot } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  getCurrentWeather(location: string): Observable<WeatherSnapshot> {
    const weather = this.buildMockWeather(location || 'Jamaica');
    return of(weather).pipe(delay(250));
  }

  private buildMockWeather(location: string): WeatherSnapshot {
    const normalized = location.toLowerCase();

    if (normalized.includes('st. elizabeth')) {
      return {
        temperature: 30,
        condition: 'Sunny intervals',
        humidity: 68,
        location
      };
    }

    if (normalized.includes('manchester')) {
      return {
        temperature: 27,
        condition: 'Light showers',
        humidity: 76,
        location
      };
    }

    return {
      temperature: 29,
      condition: 'Partly cloudy',
      humidity: 72,
      location
    };
  }
}
