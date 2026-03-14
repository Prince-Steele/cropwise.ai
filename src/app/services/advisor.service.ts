import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor() { }

  getRecommendations(farmData: any): Observable<any> {
    // Mock response simulating Python AI Backend
    const mockResponse = {
      topChoice: {
        crop: 'Tomato',
        risk: 'Low Risk',
        estimatedYield: 3500,
        daysToHarvest: '60-80 Days',
        insight: 'Tomatoes are highly compatible with your current Spring season and soil history.'
      },
      alternatives: [
        {
          crop: 'Sweet Pepper',
          risk: 'Medium Risk',
          estimatedYield: 2100,
          insight: 'Good alternative, but requires more consistent irrigation in early stages.'
        }
      ]
    };

    return of(mockResponse).pipe(delay(2000)); // Simulate AI engine latency
  }
}
